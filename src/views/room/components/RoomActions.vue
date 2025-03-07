<template>
    <div class="room-actions w-100 d-flex justify-space-between">
        <v-btn
            text="Очистить"
            color="error"
            variant="outlined"
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
import { useConfirm } from '@/composables/use-confirm'
import { useEstimatesStore } from '@/store/estimates'

const roomStore = useRoomStore()
const estimatesStore = useEstimatesStore()
const { confirm } = useConfirm()

const isEstimatesVisible = computed(() => roomStore.data?.estimatesVisible)

const switchEstimatesVisibleBtnText = computed(() => {
    return isEstimatesVisible.value
        ? 'Скрыть'
        : 'Раскрыть'
})

async function switchEstimatesVisible() {
    const roomError = await roomStore.updateEstimatesVisible(!isEstimatesVisible.value)

    roomError && toast.error('Неизвестная ошибка')
}

async function deleteEstimates() {
    if (!await confirm({
        text: 'Вы уверены, что хотите удалить все текущие оценки у всех пользователей?',
    })) return

    const roomError = await roomStore.deleteEstimates()

    if (roomError) {
        toast.error('Неизвестная ошибка')
        return
    }

    estimatesStore.resetCurrentType()
}
</script>
