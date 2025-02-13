<template>
    <div class="room-actions w-100 px-4 d-flex justify-space-between">
        <v-btn
            :text="switchEstimatesVisibleBtnText"
            variant="flat"
            :color="isEstimatesVisible ? 'secondary' : 'primary'"
            @click="switchEstimatesVisible"
        />

        <v-btn
            text="Очистить"
            variant="tonal"
            @click="cleanEstimates"
        />
    </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '@/store/room'
import { toast } from 'vue3-toastify'
import { computed } from 'vue'

const roomStore = useRoomStore()

const isEstimatesVisible = computed(() => roomStore.data?.estimatesVisible)

const switchEstimatesVisibleBtnText = computed(() => {
    return isEstimatesVisible.value
        ? 'Скрыть'
        : 'Показать'
})

async function switchEstimatesVisible() {
    const roomError = await roomStore.updateEstimatesVisible(!isEstimatesVisible.value)

    if (roomError) {
        toast.error('Неизвестная ошибка')
    }
}

function cleanEstimates() {
    console.log('cleanEstimates')
}
</script>

<style lang="scss" scoped>
.room-actions {
    max-width: var(--content-max-width);
}
</style>
