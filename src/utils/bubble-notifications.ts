import { h, render } from 'vue'
import BubbleNotification, { type BubbleNotificationProps } from '@/components/notifications/BubbleNotification.vue'

export function spawnBubbleNotification(props: BubbleNotificationProps) {
    const bubbleContainer = document.createElement('div')
    bubbleContainer.className = 'bubble-notification-container'
    document.body.appendChild(bubbleContainer)

    const vnode = h<BubbleNotificationProps>(BubbleNotification, {
        ...props,
        onAnimationComplete: () => {
            render(null, bubbleContainer)
            document.body.removeChild(bubbleContainer)
        },
    })

    render(vnode, bubbleContainer)
}
