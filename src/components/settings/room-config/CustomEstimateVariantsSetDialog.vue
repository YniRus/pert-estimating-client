<template>
    <v-dialog
        v-model="dialog"
        max-width="var(--dialog-max-width)"
    >
        <v-card>
            <v-card-title class="my-2 d-flex flex-row align-center justify-space-between">
                Свой набор

                <v-btn
                    icon="mdi-close"
                    variant="plain"
                    density="comfortable"
                    @click="dialog = false"
                />
            </v-card-title>

            <v-divider />

            <v-card-text class="pb-3">
                <v-form
                    ref="form"
                    @submit.prevent="addCustomValue"
                >
                    <v-text-field
                        v-model.number="newCustomValue"
                        label="Новое значение"
                        variant="outlined"
                        type="number"
                        min="0"
                        maxlength="3"
                        :rules="customValueRules"
                        hide-details
                        class="mb-3"
                        density="compact"
                        bg-color="white"
                    >
                        <template #append>
                            <v-btn
                                icon="mdi-plus"
                                variant="outlined"
                                :rounded="true"
                                size="small"
                                :disabled="!isValidCustomValue || isLimitCustomVariantsReached"
                                @click="addCustomValue"
                            />
                        </template>
                    </v-text-field>
                </v-form>

                <p v-if="isLimitCustomVariantsReached" class="text-caption text-error mb-2">
                    Достигнуто максимальное количество элементов (14)
                </p>

                <transition-group
                    name="value-variants-list"
                    tag="div"
                    class="d-flex flex-wrap ga-1"
                >
                    <div
                        v-for="(variant, index) in nonValueVariants"
                        :key="variant.value"
                        class="variant-card-wrapper non-value-variant"
                        :class="{ disabled: variant.disabled }"
                        @click="setDisableStateNonValueVariant(index, !variant.disabled)"
                    >
                        <EstimateVariantsSelectorCard :variant="variant.value" />
                    </div>

                    <v-divider
                        key="divider"
                        vertical
                        class="my-1 mx-1"
                    />

                    <div
                        v-for="value in sortedCustomValues"
                        :key="value"
                        class="variant-card-wrapper value-variant"
                        @click="removeCustomValue(value)"
                    >
                        <EstimateVariantsSelectorCard :variant="value" />
                    </div>
                </transition-group>
            </v-card-text>

            <v-divider />

            <v-card-actions>
                <v-spacer />

                <v-btn
                    variant="outlined"
                    color="primary"
                    text="Применить"
                    :disabled="!isSubmitAvailable"
                    @click="submitCustomVariantsSet"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import EstimateVariantsSelectorCard from '@/components/settings/room-config/EstimateVariantsSelectorCard.vue'
import type { VForm } from 'vuetify/components'
import { type EstimateVariant, NonValueUnitEstimate } from '@/definitions/estimates'
import { isNonValueUnitEstimate } from '@/utils/estimate/guards'

const { initialVariants } = defineProps<{
    initialVariants?: EstimateVariant[]
}>()

const dialog = defineModel<boolean>()
const form = ref<VForm | null>(null)

function getDefaultNonValueVariants() {
    return Object.values(NonValueUnitEstimate)
        .map((variant) => ({ value: variant, disabled: false }))
}

const nonValueVariants = ref(getDefaultNonValueVariants())

function setDisableStateNonValueVariant(index: number, newDisabledState: boolean) {
    if (isLimitCustomVariantsReached.value && newDisabledState === false) return
    nonValueVariants.value[index].disabled = !nonValueVariants.value[index].disabled
}

const newCustomValue = ref<number | null>(null)
const customValues = ref<number[]>([])

const hasCustomValues = computed(() => customValues.value.length > 0)

const sortedCustomValues = computed(() => {
    return [...customValues.value].sort((a, b) => a - b)
})

const customValueRules = [
    (value: number | null) => value !== null,
    (value: number) => Number.isFinite(value),
    (value: number) => value >= 0,
    (value: number) => value <= 999,
    (value: number) => !customValues.value.includes(formatValue(value)),
]

const isValidCustomValue = computed(() => {
    return customValueRules.every((rule) => rule(newCustomValue.value!))
})

function formatValue(value: number) {
    if (value >= 100) {
        return Math.floor(value)
    } else {
        return parseFloat(value.toFixed(1))
    }
}

async function addCustomValue() {
    if (isLimitCustomVariantsReached.value) return

    const { valid } = await form.value!.validate()
    if (!valid) return

    customValues.value.push(formatValue(newCustomValue.value!))
    newCustomValue.value = null
}

function removeCustomValue(value: number) {
    const index = customValues.value.findIndex((v) => v === value)
    if (index === -1) return

    customValues.value.splice(index, 1)
}

const customVariantsSet = computed(() => {
    const enabledNonValueVariants = nonValueVariants.value
        .filter((variant) => !variant.disabled)
        .map((variant) => variant.value)

    return [...enabledNonValueVariants, ...sortedCustomValues.value]
})

const isLimitCustomVariantsReached = computed(() => {
    return customVariantsSet.value.length >= 14
})

const hasInitialVariants = computed(() => !!initialVariants)

watch(() => initialVariants, () => {
    if (!hasInitialVariants.value) return

    const [initialNonValueVariants, initialCustomValues] = initialVariants!.reduce(([nonValueVariants, values], variant) => {
        if (isNonValueUnitEstimate(variant)) {
            nonValueVariants.push(variant)
        } else {
            values.push(variant)
        }

        return [nonValueVariants, values]
    }, [[] as NonValueUnitEstimate[], [] as number[]])

    customValues.value = initialCustomValues

    for (const nonValueVariant of initialNonValueVariants) {
        const index = nonValueVariants.value.findIndex(({ value }) => value === nonValueVariant)
        if (index !== -1) {
            nonValueVariants.value[index].disabled = false
        }
    }
}, { immediate: true })

const isChanged = computed(() => {
    const _initialVariants = initialVariants || []

    if (customVariantsSet.value.length !== _initialVariants.length) return true

    return customVariantsSet.value.some((variant, index) => variant !== _initialVariants[index])
})

const emit = defineEmits<{
    submit: [EstimateVariant[]]
}>()

const isSubmitAvailable = computed(() => {
    if (!hasCustomValues.value) return false
    if (!hasInitialVariants.value) return true

    return isChanged.value
})

function submitCustomVariantsSet() {
    if (!isSubmitAvailable.value) return
    emit('submit', customVariantsSet.value)
    dialog.value = false
}
</script>

<style lang="scss" scoped>
.variant-card-wrapper {
    cursor: pointer;
    position: relative;
    transition: opacity 0.2s ease;

    &.non-value-variant {
        &:hover {
            opacity: 0.7;
        }

        &.disabled {
            opacity: 0.4;

            &:hover {
                opacity: 0.55;
            }
        }
    }

    &.value-variant {
        &:deep(.variant-card) {
            transition: transform 0.2s ease, opacity 0.2s ease;
        }

        &:hover {
            &:deep(.variant-card) {
                transform: scale(0.9);
                opacity: 0.7;
            }
        }
    }
}

.value-variants-list {
    &-enter-active,
    &-leave-active {
        transition: all 0.3s ease;
    }

    &-leave-active {
        position: absolute;
    }

    &-enter-from,
    &-leave-to {
        transform: scale(0);
        opacity: 0;
    }

    &-move {
        transition: transform 0.3s ease;
    }
}
</style>
