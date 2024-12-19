<template>
    <Transition name="overlay">
        <div v-show="isShow" class="overlay" @click.self="isShow = false">
            <slot></slot>
        </div>
    </Transition>
</template>
<script setup lang="ts">
const isShow = defineModel<boolean>('visible')
</script>

<style scoped lang="scss">
.overlay {
    background-color: #67676772;
    height: 100vh;
    width: 100vw;
    z-index: 999999999;
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    .container {
        box-shadow: 1px 2px 3px #000;
    }
}

.overlay-enter-active,
.overlay-leave-active {
    transition: all 0.2s linear;
}

.overlay-enter-from,
.overlay-leave-to {
    transform: scale(0.8);
    opacity: 0;
}
</style>
