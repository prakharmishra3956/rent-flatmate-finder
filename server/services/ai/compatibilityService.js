const dotenv = require("dotenv");

dotenv.config();

/**
 * Calculates compatibility score and explanation between a tenant profile and a listing.
 * Includes a robust rule-based fallback mechanism.
 */
exports.calculateCompatibility = async (tenantProfile, listing) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== "") {
    try {
      const prompt = `
You are an expert AI roommate matching assistant.
Compare the following Tenant Preferences with the Room Listing Details and calculate a compatibility score (0 to 100) and a concise, conversational explanation.

Tenant Preferences:
- Preferred Location: ${tenantProfile.preferredLocation}
- Rent Budget Range: $${tenantProfile.budgetMin} to $${tenantProfile.budgetMax}
- Room Type Preference: ${tenantProfile.preferredRoomType}
- Desired Amenities: ${tenantProfile.preferredAmenities ? tenantProfile.preferredAmenities.join(", ") : "None"}

Room Listing Details:
- Title: ${listing.title}
- Location: ${listing.location}
- Address: ${listing.address}
- Rent: $${listing.rent}
- Room Type: ${listing.roomType}
- Furnishing: ${listing.furnishing}
- Amenities: ${listing.amenities ? listing.amenities.join(", ") : "None"}
- Gender Preference: ${listing.genderPreference || "Any"}
- Max Occupancy: ${listing.occupancy || 1}

Return ONLY a raw JSON object with the following structure:
{
  "score": <number between 0 and 100>,
  "explanation": "<concise 2-3 sentence explanation summarizing location, budget, room type, and amenities compatibility>"
}
Do NOT return any markdown formatting, backticks, or text before/after the JSON object.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const result = JSON.parse(text.trim());
        if (result && typeof result.score === "number" && result.explanation) {
          return {
            score: Math.min(100, Math.max(0, result.score)),
            explanation: result.explanation,
          };
        }
      }
      console.warn("Gemini API response format invalid, triggering fallback.");
    } catch (error) {
      console.error("Gemini API call failed:", error.message);
    }
  }

  // ================= RULE-BASED FALLBACK =================
  let score = 0;
  const reasons = [];

  // 1. Location Match (Max 30 points)
  const prefLoc = tenantProfile.preferredLocation.toLowerCase().trim();
  const listLoc = listing.location.toLowerCase().trim();
  const listAddr = listing.address.toLowerCase().trim();

  if (listLoc.includes(prefLoc) || prefLoc.includes(listLoc) || listAddr.includes(prefLoc)) {
    score += 30;
    reasons.push("Perfect location match.");
  } else {
    score += 10;
    reasons.push("Location does not match preferred area.");
  }

  // 2. Budget Match (Max 35 points)
  const rent = listing.rent;
  const min = tenantProfile.budgetMin;
  const max = tenantProfile.budgetMax;

  if (rent >= min && rent <= max) {
    score += 35;
    reasons.push("Rent falls perfectly within your budget.");
  } else if (rent < min) {
    score += 30;
    reasons.push("Rent is cheaper than your budget range.");
  } else {
    // Over budget penalty
    const diffPct = (rent - max) / max;
    const penalty = Math.min(35, Math.round(diffPct * 100));
    score += Math.max(0, 35 - penalty);
    reasons.push(`Rent is $${rent - max} over your maximum budget.`);
  }

  // 3. Room Type Match (Max 20 points)
  if (listing.roomType === tenantProfile.preferredRoomType) {
    score += 20;
    reasons.push(`Preferred room type (${listing.roomType}) matches.`);
  } else {
    score += 5;
    reasons.push(`Listing offers ${listing.roomType} room instead of ${tenantProfile.preferredRoomType}.`);
  }

  // 4. Amenities Match (Max 15 points)
  const prefAms = tenantProfile.preferredAmenities || [];
  const listAms = listing.amenities || [];

  if (prefAms.length === 0) {
    score += 15;
    reasons.push("No specific amenities required.");
  } else {
    const matches = prefAms.filter((am) =>
      listAms.some((lAm) => lAm.toLowerCase().includes(am.toLowerCase()))
    );
    const matchRatio = matches.length / prefAms.length;
    score += Math.round(matchRatio * 15);
    if (matches.length > 0) {
      reasons.push(`Matches preferred amenities: ${matches.join(", ")}.`);
    } else {
      reasons.push("None of your preferred amenities were listed.");
    }
  }

  const finalScore = Math.min(100, Math.max(0, score));
  const explanation = `Compatibility score is ${finalScore}%. ${reasons.join(" ")}`;

  return {
    score: finalScore,
    explanation,
  };
};
