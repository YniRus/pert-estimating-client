<template>
    <v-menu
        v-model="menu"
        location="left"
        offset="10"
    >
        <template #activator="{ props }">
            <v-btn
                v-bind="props"
                icon="mdi-dots-vertical"
                variant="text"
                size="x-small"
                density="comfortable"
                :ripple="false"
            />
        </template>

        <v-list
            class="text-caption"
            density="compact"
            slim
        >
            <v-list-item
                v-if="actions.has(EstimateVariantsSetMenuAction.CopyToClipboard)"
                prepend-icon="mdi-content-copy"
                title="Копировать в буфер обмена"
                @click.stop="emit('action', EstimateVariantsSetMenuAction.CopyToClipboard); menu = false"
            />

            <v-list-item
                v-if="actions.has(EstimateVariantsSetMenuAction.CreateCopy)"
                prepend-icon="mdi-pencil-box-multiple-outline"
                title="Создать копию"
                @click.stop="emit('action', EstimateVariantsSetMenuAction.CreateCopy)"
            />

            <v-list-item
                v-if="actions.has(EstimateVariantsSetMenuAction.Edit)"
                prepend-icon="mdi-pencil"
                title="Редактировать"
                @click.stop="emit('action', EstimateVariantsSetMenuAction.Edit)"
            />

            <v-list-item
                v-if="actions.has(EstimateVariantsSetMenuAction.Delete)"
                prepend-icon="mdi-delete-outline"
                title="Удалить"
                base-color="error"
                @click.stop="emit('action', EstimateVariantsSetMenuAction.Delete)"
            />
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import { EstimateVariantsSetMenuAction } from '@/definitions/estimate-variants-sets'
import { ref } from 'vue'

const { actions } = defineProps<{
    actions: Set<EstimateVariantsSetMenuAction>
}>()

const emit = defineEmits<{
    action: [EstimateVariantsSetMenuAction]
}>()

const menu = ref(false)
</script>
