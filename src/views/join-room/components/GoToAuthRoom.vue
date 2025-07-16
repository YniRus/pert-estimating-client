<template>
    <v-snackbar
        v-if="authData"
        v-model="visible"
        timeout="-1"
        variant="text"
        rounded="pill"
        class="go-to-auth-room-snackbar mb-4"
        max-width="var(--dialog-max-width)"
        transition="slide-y-reverse-transition"
    >
        <div class="d-flex flex-row align-center pa-1 rounded-pill elevation-3 bg-white">
            <div class="overline d-flex justify-space-between align-center mb-1 px-1 w-100">
                <p
                    v-tooltip="{
                        text: description,
                        contentClass: 'text-center',
                    }"
                    class="d-flex flex-row text-overline"
                >
                    Найдена авторизация

                    <v-icon
                        color="grey-lighten-1"
                        icon="mdi-information-outline"
                        class="align-self-center ml-1"
                    />
                </p>

                <v-btn
                    variant="plain"
                    :ripple="false"
                    icon="mdi-close"
                    size="x-small"
                    @click="visible = false"
                />
            </div>

            <p class="d-flex align-center ga-2 mx-2 text-truncate">
                <v-chip
                    v-if="authData.user.role"
                    color="primary"
                    size="x-small"
                    variant="flat"
                    class="flex-shrink-0"
                >
                    {{ getRoleShortTitle(authData.user.role) }}
                </v-chip>

                <span
                    v-tooltip="{
                        text: authData.user.name,
                        openDelay: 500,
                        maxWidth: 400,
                        offset: 16,
                    }"
                    class="text-body-1 text-truncate"
                >
                    {{ authData.user.name }}
                </span>
            </p>

            <v-btn
                v-tooltip="{ text: 'Войти' }"
                color="success"
                variant="outlined"
                icon="mdi-chevron-right"
                size="small"
                class="ml-auto"
                @click="goToRoom"
            />
        </div>
    </v-snackbar>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import RouteName from '@/router/route-name'
import type { UID } from '@/definitions/aliases'
import { useAuthStore } from '@/store/auth'
import { getRoleShortTitle } from '@/utils/role'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps<{
    roomId?: UID
}>()

const visible = ref(false)

const authData = computed(() => authStore.data)

const description = computed(() => {
    if (!props.roomId) {
        return 'Вы можете войти в последнюю авторизованную комнату как указанный пользователь'
    }

    const isEqualRoom = authData.value?.roomId === props.roomId
    return isEqualRoom
        ? 'Вы уже авторизованы в этой комнате как указанный пользователь'
        : 'Вы уже авторизованы в другой комнате как указанный пользователь'
})

function goToRoom() {
    router.push({ name: RouteName.Room, params: { roomId: authData.value!.roomId } })
}

onMounted(async () => {
    await authStore.auth()

    if (authStore.data) {
        visible.value = true
    }
})
</script>

<style scoped lang="scss">
.go-to-auth-room-snackbar {
    :deep(.v-snackbar__content) { /* stylelint-disable-line */
        width: 100%;
        padding: unset;
    }

    :deep(.v-snackbar__wrapper) { /* stylelint-disable-line */
        overflow: visible;
    }

    .overline {
        position: absolute;
        bottom: calc(100%);
    }
}
</style>
