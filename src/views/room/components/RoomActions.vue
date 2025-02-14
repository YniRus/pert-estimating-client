<template>
    <div class="room-actions w-100 px-4 d-flex justify-space-between">
        <v-btn
            text="Очистить"
            variant="text"
            @click="deleteEstimates"
        />

        <v-btn
            :text="switchEstimatesVisibleBtnText"
            variant="outlined"
            :color="isEstimatesVisible ? 'primary' : 'default'"
            :prepend-icon="isEstimatesVisible ? 'mdi-eye-off' : 'mdi-eye'"
            :width="146"
            @click="switchEstimatesVisible"
        />
    </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '@/store/room'
import { toast } from 'vue3-toastify'
import { computed } from 'vue'
import { useConfirm } from 'vuetify-use-dialog'

const roomStore = useRoomStore()

const confirm = useConfirm()

const isEstimatesVisible = computed(() => roomStore.data?.estimatesVisible)

const switchEstimatesVisibleBtnText = computed(() => {
    return isEstimatesVisible.value
        ? 'Скрыть'
        : 'Показать'
})

async function switchEstimatesVisible() {
    const roomError = await roomStore.updateEstimatesVisible(!isEstimatesVisible.value)

    roomError && toast.error('Неизвестная ошибка')
}

async function deleteEstimates() {
    const isConfirmed = await confirm({ content: 'Очистка оценок удалит все текущие оценки у всех пользователей.' })
    if (!isConfirmed) return

    const roomError = await roomStore.deleteEstimates()

    roomError && toast.error('Неизвестная ошибка')
}
</script>

<style lang="scss" scoped>
.room-actions {
    max-width: var(--content-max-width);
}
</style>
