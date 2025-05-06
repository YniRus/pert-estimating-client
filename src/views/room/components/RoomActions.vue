<template>
    <div
        ref="actions"
        class="room-actions d-flex justify-space-between align-center"
        :class="{ 'is-sticky': isSticky }"
    >
        <template v-if="isSticky">
            <v-btn
                color="error"
                variant="outlined"
                icon="mdi-refresh"
                :disabled
                @click="deleteEstimates"
            />

            <v-btn
                variant="outlined"
                :color="isEstimatesVisible ? 'primary' : 'default'"
                :icon="isEstimatesVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :disabled
                @click="switchEstimatesVisible"
            />
        </template>

        <template v-else>
            <v-btn
                text="Очистить"
                color="error"
                variant="outlined"
                prepend-icon="mdi-refresh"
                :width="146"
                :disabled
                @click="deleteEstimates"
            />

            <v-slide-y-reverse-transition leave-absolute>
                <RoomLastEstimateTimer
                    v-if="lastEstimateTimerStore.isEnabled"
                    :disabled
                />
            </v-slide-y-reverse-transition>

            <v-btn
                :text="switchEstimatesVisibleBtnText"
                variant="outlined"
                :color="isEstimatesVisible ? 'primary' : 'default'"
                :prepend-icon="isEstimatesVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :width="146"
                :disabled
                @click="switchEstimatesVisible"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '@/store/room'
import { toast } from 'vue3-toastify'
import { computed, ref, onMounted, onBeforeUnmount, useTemplateRef, watch } from 'vue'
import { useConfirm } from '@/composables/use-confirm'
import { useRoomGroupedUsers } from '@/store/composables/use-room-grouped-users'
import RoomLastEstimateTimer from '@/components/estimate/timer/RoomLastEstimateTimer.vue'
import { useLastEstimateTimerStore } from '@/store/last-estimate-timer'
import { useDeleteEstimatesWatcher } from '@/store/composables/use-delete-estimates-watcher'

const roomStore = useRoomStore()
const { confirm } = useConfirm()

const { hasUsersWhoCanEstimates } = useRoomGroupedUsers()
const { onRoomDeleteEstimates } = useDeleteEstimatesWatcher()
const lastEstimateTimerStore = useLastEstimateTimerStore()

const disabled = computed(() => !hasUsersWhoCanEstimates.value)

const isEstimatesVisible = computed(() => {
    if (!hasUsersWhoCanEstimates.value) return false

    return roomStore.data?.estimatesVisible
})

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

    onRoomDeleteEstimates()
}

const actionsRef = useTemplateRef<HTMLDivElement>('actions')

let observer: IntersectionObserver | null = null
const STICKY_BREAKPOINT = 950
const isSticky = ref(false)
const canSticky = ref(window.innerWidth >= STICKY_BREAKPOINT)

onMounted(() => {
    if (!actionsRef.value) return

    setupObserver()
    window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    disconnectObserver()
})

function onResize() {
    canSticky.value = window.innerWidth >= STICKY_BREAKPOINT
}

watch(canSticky, () => {
    if (canSticky.value) {
        setupObserver()
    } else {
        disconnectObserver()
        isSticky.value = false
    }
})

function setupObserver() {
    if (!canSticky.value || !actionsRef.value) return

    disconnectObserver()

    observer = new IntersectionObserver((entries) => {
        isSticky.value = !entries[0].isIntersecting
    }, { threshold: 1, rootMargin: '-1px 0px 0px 0px' })

    observer.observe(actionsRef.value)
}

function disconnectObserver() {
    if (observer) {
        observer.disconnect()
        observer = null
    }
}
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use 'vuetify/settings' as v-settings;

.room-actions {
    width: 100%;

    @media (width >= 950px) {
        position: sticky;
        top: 0;
        transition: width 0.2s ease-out, padding-top 0s;

        &.is-sticky {
            $sticky-button-height: 48px;

            pointer-events: none;
            width: calc(var(--content-max-width) + #{$sticky-button-height} * 2);
            padding-top: map.get(v-settings.$spacers, 5);

            > * {
                pointer-events: auto;
            }
        }
    }
}
</style>
