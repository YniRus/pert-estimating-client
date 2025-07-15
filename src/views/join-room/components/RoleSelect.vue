<template>
    <div class="role-select-container">
        <v-menu
            v-model="roleMenuOpen"
            :close-on-content-click="false"
        >
            <template #activator="{ props: menuProps }">
                <v-select
                    readonly
                    v-bind="menuProps"
                    :model-value="modelValue"
                    width="100"
                    variant="outlined"
                    class="role-select"
                    hide-details
                    label="Роль"
                >
                    <template #selection>
                        {{ getRoleShortTitle(modelValue) }}
                    </template>
                </v-select>
            </template>

            <v-card width="250">
                <v-list
                    class="roles-select-list"
                    :opened="[roleOpenedSubmenu]"
                    active-strategy="independent"
                >
                    <template
                        v-for="(item, index) in roleSelectItems"
                        :key="index"
                    >
                        <template v-if="item.type === 'subheader'">
                            <v-divider />
                            <v-list-subheader>{{ item.title }}</v-list-subheader>
                        </template>

                        <template v-if="item.type === 'item'">
                            <v-list-group
                                v-if="item.subitems"
                                :value="item.value"
                            >
                                <template #activator="{ props, isOpen }">
                                    <v-list-item
                                        v-bind="props"
                                        :title="item.title"
                                        :subtitle="item.subtitle"
                                        :active="modelValue === item.value"
                                        @click="selectRole(item.value)"
                                    >
                                        <template #append>
                                            <v-btn
                                                :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                                variant="text"
                                                size="small"
                                                base-color="black"
                                                @click.stop="props.onClick"
                                            />
                                        </template>
                                    </v-list-item>
                                </template>

                                <v-list-item
                                    v-for="subitem in item.subitems"
                                    :key="subitem.value"
                                    :title="subitem.title"
                                    :subtitle="subitem.subtitle"
                                    :lines="false"
                                    :active="modelValue === subitem.value"
                                    @click="selectRole(subitem.value)"
                                />
                            </v-list-group>

                            <v-list-item
                                v-else
                                :title="item.title"
                                :subtitle="item.subtitle"
                                :lines="false"
                                :active="modelValue === item.value"
                                @click="selectRole(item.value)"
                            />
                        </template>
                    </template>
                </v-list>
            </v-card>
        </v-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { UserRole } from '@/definitions/user'
import { getRoleDescription, getRoleShortTitle, getRoleTitle } from '@/utils/role'

type RoleSelectItem<T = 'item' | 'subheader'> = {
    type: T
    value?: string
    title: string
    subtitle?: string
    subitems?: RoleSelectItem<'item'>[]
}

const modelValue = defineModel<UserRole | ''>()

const roleMenuOpen = ref(false)

const specialRoles = [UserRole.RoomAdmin]

const subRoles: Partial<Record<UserRole, UserRole[]>> = {
    [UserRole.Dev]: [UserRole.Frontend, UserRole.Backend],
}

const baseRoles = Object.values(UserRole).filter((role) => {
    return ![...specialRoles, ...Object.values(subRoles).flat()].includes(role)
})

const roleSelectItems = computed<RoleSelectItem[]>(() => {
    return [
        { type: 'item', value: '', title: getRoleTitle('') },
        { type: 'subheader', title: 'Базовые роли' },
        ...baseRoles.map(getRoleSelectItem),
        { type: 'subheader', title: 'Специальные роли' },
        ...specialRoles.map(getRoleSelectItem),
    ]
})

function getRoleSelectItem(role: UserRole): RoleSelectItem<'item'> {
    return {
        type: 'item',
        value: role,
        title: getRoleTitle(role),
        subtitle: getRoleDescription(role),
        subitems: subRoles[role] ? subRoles[role]!.map(getRoleSelectItem) : undefined,
    }
}

const roleOpenedSubmenu = computed(() => {
    for (const [parentRole, childRoles] of Object.entries(subRoles)) {
        if (childRoles.includes(modelValue.value as UserRole)) {
            return parentRole
        }
    }
    return undefined
})

function selectRole(newRole?: string) {
    if (!Object.values(UserRole).includes(newRole as UserRole) && newRole !== '') return

    modelValue.value = newRole as UserRole | ''
    roleMenuOpen.value = false
}
</script>

<style scoped lang="scss">
.roles-select-list {
    /* stylelint-disable */
    :deep(.v-list-group__header.v-list-item--active:not(:focus-visible)) {
        .v-list-item__overlay {
            opacity: calc(var(--v-activated-opacity) * var(--v-theme-overlay-multiplier));
        }
    }
    /* stylelint-enable */
}
</style>
