<template>
    <v-snackbar
        v-if="authData"
        v-model="visible"
        timeout="-1"
        variant="elevated"
        color="white"
        rounded="lg"
        class="go-to-auth-room-snackbar pb-3"
        multi-line
    >
        <v-card max-width="360">
            <v-card-title>Найдена авторизация</v-card-title>

            <v-card-subtitle class="text-wrap">
                <span v-html="subtitle" />
            </v-card-subtitle>

            <v-card-text class="pb-2">
                <div class="auth-user-with-avatar">
                    <v-avatar
                        color="primary"
                        class="text-uppercase"
                        :icon="authData.user.role ? '' : 'mdi-account'"
                        :text="authData.user.role"
                        size="40"
                    />

                    <span class="text-body-1 ml-2">{{ authData.user.name }}</span>
                </div>
            </v-card-text>

            <v-card-actions>
                <v-btn
                    text="Войти"
                    @click="goToRoom"
                />

                <v-btn
                    color="red-lighten-2"
                    text="Закрыть"
                    @click="visible = false"
                />
            </v-card-actions>
        </v-card>
    </v-snackbar>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import RouteName from '@/router/route-name'
import type { UID } from '@/definitions/aliases'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps<{
    roomId?: UID
}>()

const visible = ref(false)

const authData = computed(() => authStore.data)

const subtitle = computed(() => {
    if (!props.roomId) {
        return 'Вы можете войти в последнюю авторизованную комнату как:'
    }

    const isEqualRoom = authData.value?.roomId === props.roomId
    return isEqualRoom
        ? 'Вы уже авторизованы в <b>этой</b> комнате как:'
        : 'Вы уже авторизованы в <b>другой</b> комнате как:'
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
        padding: unset;
    }
}
</style>
