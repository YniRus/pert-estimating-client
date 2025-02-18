<template>
    <v-card
        class="estimate-variant-card px-1 py-12"
        @click="emit('select', value)"
    >
        <v-card-text class="text-center pa-0 text-h4">
            {{ value }}
        </v-card-text>

        <v-menu
            location="top"
            open-on-hover
            transition="slide-y-reverse-transition"
        >
            <template #activator="{ props }">
                <EstimateUnit
                    class="estimate-unit-selector"
                    v-bind="props"
                    :unit="unit"
                />
            </template>

            <div class="d-flex flex-column ga-1 pb-1">
                <template
                    v-for="estimateUnit of EstimateUnitEnum"
                    :key="`estimate-${estimateUnit}`"
                >
                    <EstimateUnit
                        v-if="estimateUnit !== unit"
                        :unit="estimateUnit"
                        class="cursor-pointer"
                        @click.stop="emit('select', value, estimateUnit)"
                    />
                </template>
            </div>
        </v-menu>
    </v-card>
</template>

<script setup lang="ts">
import { EstimateUnit as EstimateUnitEnum } from '@/definitions/estimates'
import EstimateUnit from '@/components/estimate/EstimateUnit.vue'

defineProps<{
    value: number
    unit: EstimateUnitEnum
}>()

const emit = defineEmits<{
    select: [number, EstimateUnitEnum?]
}>()
</script>

<style lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as v-settings;

.estimate-variant-card {
    position: relative;
    display: flex;
    min-width: 100px;
    max-width: 50%;

    .estimate-unit-selector {
        position: absolute;
        right: 0;
        bottom: map.get(v-settings.$spacers, 1);

        font-size: v-settings.$badge-font-size;
        line-height: v-settings.$badge-line-height;
    }
}
</style>
