<template>
    <v-card
        class="estimate-variant-card d-flex px-1 py-11"
        :disabled="disabled || !canEstimate"
        @click="onSelect(variant)"
    >
        <v-card-text class="align-self-center text-center pa-0">
            <v-icon
                v-if="isNonValueUnitEstimate(variant)"
                :icon="getNonValueUnitEstimateIcon(variant)"
                :size="getNonValueUnitEstimateIconSize(variant)"
            />

            <span v-else class="text-h4">{{ variant }}</span>

            <v-icon
                v-if="helpText"
                v-tooltip="{
                    text: helpText,
                    contentClass: 'text-center',
                    maxWidth: 250,
                }"
                class="estimate-help ma-1 pointer-events-auto"
                icon="mdi-information-outline"
                size="small"
                color="grey"
            />
        </v-card-text>

        <v-menu
            v-if="!isNonValueUnitEstimate(variant) && canEstimate"
            location="top"
            open-on-hover
            :offset="4"
            :disabled="disabled"
            transition="slide-y-reverse-transition"
        >
            <template #activator="{ props }">
                <EstimateUnit
                    class="estimate-unit-selector mr-1"
                    v-bind="props"
                    :unit="estimatesStore.unit"
                />
            </template>

            <div class="d-flex flex-column ga-1">
                <template
                    v-for="estimateUnit of EstimateUnitEnum"
                    :key="`estimate-${estimateUnit}`"
                >
                    <EstimateUnit
                        v-if="estimateUnit !== estimatesStore.unit"
                        :unit="estimateUnit"
                        class="cursor-pointer"
                        @click.stop="onSelectValueWithCustomUnit(variant, estimateUnit)"
                    />
                </template>
            </div>
        </v-menu>
    </v-card>
</template>

<script setup lang="ts">
import {
    EstimateUnit as EstimateUnitEnum, type EstimateVariant,
    NonValueUnitEstimate,
    type UserSetEstimate,
} from '@/definitions/estimates'
import EstimateUnit from '@/components/estimate/EstimateUnit.vue'
import { useEstimatesStore } from '@/store/estimates'
import { getNonValueUnitEstimateIcon } from '@/utils/estimate/ui'
import { isNonValueUnitEstimate } from '@/utils/estimate/guards'
import { computed } from 'vue'

const estimatesStore = useEstimatesStore()

const { variant } = defineProps<{
    variant: EstimateVariant
    disabled?: boolean
    canEstimate?: boolean
}>()

const emit = defineEmits<{
    select: [UserSetEstimate]
}>()

const helpText = computed(() => {
    if (isNonValueUnitEstimate(variant)) {
        return 'Такой вариант не учитывается при расчетах и приравнен к —. Но так вы можете сообщить всем что проставили оценку.'
    }
    return ''
})

function getNonValueUnitEstimateIconSize(estimate: NonValueUnitEstimate) {
    switch (estimate) {
        case NonValueUnitEstimate.Chill: return 'x-large'
        case NonValueUnitEstimate.IDontKnow: return 'large'
    }
}

function onSelect(value: NonValueUnitEstimate | number) {
    if (isNonValueUnitEstimate(value)) {
        emit('select', value)
    } else {
        emit('select', { value })
    }
}

function onSelectValueWithCustomUnit(value: number, unit: EstimateUnitEnum) {
    emit('select', { value, unit })
}
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use 'vuetify/settings' as v-settings;

.estimate-variant-card {
    width: var(--estimate-variant-card-width);

    .estimate-unit-selector {
        position: absolute;
        right: 0;
        bottom: map.get(v-settings.$spacers, 1);

        font-size: v-settings.$badge-font-size;
        line-height: v-settings.$badge-line-height;
    }

    .estimate-help {
        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>
