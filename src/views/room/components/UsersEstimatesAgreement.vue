<template>
    <v-tooltip
        v-model="tooltipOpen"
        location="top"
        content-class="estimates-agreement-tooltip"
        :open-on-focus="true"
        :open-on-click="true"
    >
        <template #activator="{ props: activatorProps }">
            <button
                v-bind="activatorProps"
                type="button"
                class="agreement-indicator d-inline-flex align-center justify-center flex-shrink-0 pa-1 border-0 bg-transparent"
                :aria-label="`Согласованность: ${formatAgreement(agreement)}`"
            >
                <EstimateAgreementGauge :percentage="agreement" />
            </button>
        </template>

        <div class="d-flex align-center justify-center ga-1 mb-2">
            <span>Согласованность:</span>
            <v-icon
                :style="{ color: getAgreementColor(agreement) }"
                icon="mdi-circle"
                size="x-small"
            />
            <span>{{ formatAgreement(agreement) }}</span>
        </div>
        <table class="text-caption text-center mx-auto" aria-label="Согласованность по типам оценок">
            <thead>
                <tr>
                    <th
                        v-for="item in typeAgreements"
                        :key="item.type"
                        scope="col"
                        class="text-uppercase font-weight-regular px-2"
                    >
                        {{ item.type }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td
                        v-for="item in typeAgreements"
                        :key="item.type"
                        class="px-2"
                    >
                        <div class="d-flex align-center justify-center ga-1">
                            <v-icon
                                :style="{ color: getAgreementColor(item.agreement) }"
                                icon="mdi-circle"
                                size="x-small"
                            />
                            <span>{{ formatAgreement(item.agreement) }}</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </v-tooltip>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import type { User } from '@/definitions/user'
import { EstimateType } from '@/definitions/estimates'
import { calculateEstimatesAgreement } from '@/utils/estimate-agreement'
import { getAgreementColor } from '@/utils/estimate-agreement-presentation'
import EstimateAgreementGauge from '@/components/estimate/EstimateAgreementGauge.vue'

const props = defineProps<{ users: User[] }>()
const tooltipOpen = ref(false)
useEventListener('keydown', (event) => {
    if (event.key === 'Escape') tooltipOpen.value = false
})
const estimates = computed(() => props.users.map((user) => user.estimates.estimates))
const agreement = computed(() => calculateEstimatesAgreement(estimates.value))
const typeAgreements = computed(() => Object.values(EstimateType).map((type) => ({
    type,
    agreement: calculateEstimatesAgreement(estimates.value, type),
})))

function formatAgreement(value: number | null) {
    return value === null ? '—' : `${value.toLocaleString('ru-RU')}%`
}
</script>

<style lang="scss">
.estimates-agreement-tooltip {
    pointer-events: auto;
}
</style>

<style scoped lang="scss">
.agreement-indicator {
    color: inherit;

    &:focus-visible {
        outline: 2px solid currentcolor;
        outline-offset: 2px;
    }
}
</style>
