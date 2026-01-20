/* eslint-disable */
export default async () => {
    const t = {
        ["./evaluations/dto/create-evaluation.dto"]: await import("./evaluations/dto/create-evaluation.dto"),
        ["./auth/models/token.model"]: await import("./auth/models/token.model")
    };
    return { "@nestjs/swagger/plugin": { "models": [[import("./evaluations/dto/create-evaluation.dto"), { "CriterionScoreDto": { criterionId: { required: true, type: () => String }, note: { required: true, type: () => Number, minimum: 1, maximum: 5 } }, "CreateEvaluationDto": { disciplineId: { required: true, type: () => String }, teacherId: { required: true, type: () => String }, comment: { required: true, type: () => String }, scores: { required: true, type: () => [t["./evaluations/dto/create-evaluation.dto"].CriterionScoreDto] } } }]], "controllers": [[import("./app.controller"), { "AppController": { "getHealth": {} } }], [import("./auth/auth.controller"), { "AuthController": { "signup": { type: t["./auth/models/token.model"].Token }, "login": { type: t["./auth/models/token.model"].Token }, "refresh": { type: t["./auth/models/token.model"].Token }, "me": {} } }], [import("./evaluations/evaluations.controller"), { "EvaluationsController": { "create": { type: Object }, "findMine": { type: [Object] }, "findByTeacher": { type: [Object] }, "getAverage": {} } }]] } };
};