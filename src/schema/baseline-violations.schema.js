/* generated - don't edit */

module.exports = {
  title: "dependency-cruiser baseline ('known errors') format",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://dependency-cruiser.js.org/schema/baseline-violations.schema.json",
  $ref: "#/definitions/ViolationsType",
  definitions: {
    ViolationsType: {
      type: "array",
      items: { $ref: "#/definitions/ViolationType" },
    },
    ViolationType: {
      type: "object",
      required: ["from", "to", "rule"],
      additionalProperties: false,
      properties: {
        from: { type: "string" },
        to: { type: "string" },
        type: {
          type: "string",
          enum: [
            "dependency",
            "module",
            "reachability",
            "cycle",
            "instability",
          ],
        },
        rule: { $ref: "#/definitions/RuleSummaryType" },
        cycle: { type: "array", items: { type: "string" } },
        via: { type: "array", items: { type: "string" } },
        metrics: {
          type: "object",
          required: ["from", "to"],
          additionalProperties: false,
          properties: {
            from: {
              type: "object",
              required: ["instability"],
              additionalProperties: false,
              properties: { instability: { type: "number" } },
            },
            to: {
              type: "object",
              required: ["instability"],
              additionalProperties: false,
              properties: { instability: { type: "number" } },
            },
          },
        },
      },
    },
    RuleSummaryType: {
      type: "object",
      required: ["name", "severity"],
      additionalProperties: false,
      properties: {
        name: { type: "string" },
        severity: { $ref: "#/definitions/SeverityType" },
      },
    },
    SeverityType: { type: "string", enum: ["error", "warn", "info", "ignore"] },
  },
};
