<template>
    <div class="d-flex align-center justify-center ga-1">
        <img
            src="@/assets/icons/rest.svg"
            class="sleeping-cat"
            height="30"
        />

        <div class="sleeping-animation">
            <span class="z z1">z</span>
            <span class="z z2">z</span>
            <span class="z z3">z</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.sleeping-animation {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    width: 20px;
    height: 30px;

    .z {
        position: absolute;
        font-size: 12px;
        opacity: 0;
        animation: float-up 6s infinite;
    }

    .z1 {
        animation-delay: 0s;
    }

    .z2 {
        animation-delay: 1s;
    }

    .z3 {
        animation-delay: 2s;
    }
}

@keyframes float-up {
    0% {
        transform: translateY(0) translateX(0) rotate(0);
        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    60% {
        transform: translateY(-15px) translateX(12px) rotate(15deg);
        opacity: 0;
    }

    100% {
        opacity: 0;
    }
}
</style>
