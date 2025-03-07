import { mount, VueWrapper } from '@vue/test-utils'
import EstimatesOrderUserSettings from '@/components/settings/user-settings/EstimatesOrderUserSettings.vue'
import { createTestingPinia } from '@pinia/testing'
import { createVuetify } from 'vuetify'
import { useEstimatesOrderStore } from '@/store/estimates-order'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { EstimateType } from '@/definitions/estimates'

describe('EstimatesOrderUserSettings', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
        localStorage.clear()

        const pinia = createTestingPinia({
            stubActions: false,
        })
        const vuetify = createVuetify()

        wrapper = mount(EstimatesOrderUserSettings, {
            global: {
                plugins: [pinia, vuetify],
            },
        })
    })

    it('should render buttons per EstimateType by default order and data', async () => {
        const defaultOrder = [EstimateType.Min, EstimateType.Probable, EstimateType.Max]
        const store = useEstimatesOrderStore()

        await nextTick()

        const buttons = wrapper.findAll('[data-test-id^="estimate-type-"]')

        expect(buttons.length).toBe(store.data.length)

        store.data.forEach((_, index) => {
            expect(buttons[index].text()).toContain(defaultOrder[index])
            expect(buttons[index].classes('disabled')).toBe(false)
        })
    })

    it('should handle sort correctly', async () => {
        const store = useEstimatesOrderStore()
        const originalData = [...store.data]

        // Имитируем drag-and-drop
        const draggable = wrapper.findComponent({ name: 'VueDraggableNext' })
        await draggable.vm.$emit('sort', {
            oldIndex: 0,
            newIndex: 1,
        })

        expect(store.data).toEqual([
            originalData[1],
            originalData[0],
            originalData[2],
        ])
    })

    it('should correct set disabled state', async () => {
        const store = useEstimatesOrderStore()
        store.$patch({
            data: [
                { type: EstimateType.Min },
                { type: EstimateType.Probable },
                { type: EstimateType.Max, disabled: true },
            ],
        })

        await nextTick()

        const buttons = wrapper.findAll('[data-test-id^="estimate-type-"]')

        await buttons[1].trigger('click')
        expect(store.data[1].disabled).toBe(true)

        await buttons[1].trigger('click')
        expect(store.data[1].disabled).toBe(false)

        await buttons[2].trigger('click')
        expect(store.data[2].disabled).toBe(false)
    })

    it('should not allow disabling the last active item', async () => {
        const store = useEstimatesOrderStore()
        store.$patch({
            data: [
                { type: EstimateType.Probable, disabled: false },
                { type: EstimateType.Max, disabled: true },
                { type: EstimateType.Min, disabled: true },
            ],
        })

        await nextTick()

        const buttonProbable = wrapper.find(`[data-test-id="estimate-type-${EstimateType.Probable}"]`)
        await buttonProbable.trigger('click')

        const probableStoreDataItem = store.data.find((item) => item.type === EstimateType.Probable)?.disabled
        expect(probableStoreDataItem).toBe(false)
    })
})
