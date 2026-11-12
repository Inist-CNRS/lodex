import { default as z } from 'zod';
import { isEmpty } from '../lib/isEmpty';

export const MODEL_IMPORT_TYPES = ['file', 'url', 'text'] as const;
export type ModelImportType = (typeof MODEL_IMPORT_TYPES)[number];

export const MODEL_LAUNCH_STEP_TYPES = ['enrichment', 'precomputed'] as const;
export type ModelLaunchStepType = (typeof MODEL_LAUNCH_STEP_TYPES)[number];

// An empty value ('', [], null) behaves like a missing field
const emptyAsMissing = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess(
        (value) => (isEmpty(value) ? undefined : value),
        schema.optional(),
    );

// Only absolute http(s) links: no javascript:, relative or other protocols
const httpLinkSchema = z.string().regex(/^https?:\/\//i);

const launchStepSchema = z.object({
    name: z.string().min(1),
    type: z.enum(MODEL_LAUNCH_STEP_TYPES),
    position: z.number().int().min(1),
});

const hasUniqueEnrichmentPositions = (
    steps: z.infer<typeof launchStepSchema>[],
) => {
    const positions = steps
        .filter((step) => step.type === 'enrichment')
        .map((step) => step.position);
    return new Set(positions).size === positions.length;
};

// Name and description (both required) are NOT stored here: they live in
// translations.tsv under mc_<id>_title / mc_<id>_description, like precomputers.
// Their presence (FR + EN) is enforced by getDisplayableModels via hasTranslation.
export const catalogModelSchema = z
    .object({
        id: z.string().min(1),
        url: httpLinkSchema,
        loader: z.string().min(1),
        doc: emptyAsMissing(httpLinkSchema),
        demo: emptyAsMissing(httpLinkSchema),
        /** Recommended theme: a folder name of src/app/custom/themes/ */
        theme: emptyAsMissing(z.string()),
        /** Import types offered in the wizard, in this order */
        importTypes: z
            .array(z.enum(MODEL_IMPORT_TYPES))
            .min(1)
            .refine((types) => new Set(types).size === types.length),
        /** Help shown above the data input of the wizard, in both languages */
        importHelp: emptyAsMissing(
            z.object({ fr: z.string().min(1), en: z.string().min(1) }),
        ),
        launchOrder: emptyAsMissing(
            z.array(launchStepSchema).refine(hasUniqueEnrichmentPositions),
        ),
    })
    // Drop keys left to undefined by emptyAsMissing, so that spreading a model
    // over defaults never overrides them with undefined
    .transform(
        (model) =>
            Object.fromEntries(
                Object.entries(model).filter(
                    ([, value]) => value !== undefined,
                ),
            ) as typeof model,
    );

export type ModelLaunchStep = z.infer<typeof launchStepSchema>;
export type CatalogModel = z.infer<typeof catalogModelSchema>;

export const getModelTitleKey = (id: string) => `mc_${id}_title`;
export const getModelDescriptionKey = (id: string) => `mc_${id}_description`;
