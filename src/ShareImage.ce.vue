<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import html2canvas from 'html2canvas'
import Overlay from './components/Overlay.ce.vue'
import QRcode from 'qrcode'
import { getWebsiteInfo } from './utils/info'
import { cutText } from './utils/text'

const fontFamily =
    'PingFangSC, Open Sans, Helvetica Neue, Arial, Hiragino Sans GB, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif'

const imgContainerRef = ref<HTMLElement>()
const hiddenRef = ref<HTMLElement>()

const qrcodeUrl = ref<string>()
const showText = ref<string>()
const isShowModal = ref(false)
const isShowImg = ref(false)

const webSiteInfo = ref(getWebsiteInfo())

watch(isShowModal, val => {
    if (!val) {
        isShowImg.value = false
        imgContainerRef.value?.replaceChildren()
    }
})

const showPopup = async (selectedText: string) => {
    isShowModal.value = true
    await nextTick()

    const info = getWebsiteInfo()
    webSiteInfo.value = {
        ...info,
        title: cutText(info.title, 200, 2, {
            fontSize: '14px',
            fontWeight: '500',
            fontFamily
        }),
        description: cutText(info.description || '', 200, 2, {
            fontSize: '12px',
            fontWeight: '400',
            fontFamily
        })
    }
    await nextTick()

    QRcode.toDataURL(webSiteInfo.value.url, async (_, url) => {
        showText.value = selectedText
        qrcodeUrl.value = url

        await nextTick()

        if (hiddenRef.value) {
            html2canvas(hiddenRef.value, {
                allowTaint: true,
                backgroundColor: null,
                onclone: (_, el) => {
                    el.style.display = 'block'
                }
            }).then(canvas => {
                canvas.style.boxShadow =
                    '0 1px 2px 0 rgba(0, 0, 0, 0.03),0 1px 6px -1px rgba(0, 0, 0, 0.02),0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                imgContainerRef.value?.replaceChildren(canvas)
                isShowImg.value = true
            })
        }
    })
}

chrome.runtime.onMessage.addListener(res => {
    showPopup(window.getSelection()?.toString() || res.text)
})
</script>

<template>
    <Overlay v-model:visible="isShowModal">
        <Transition name="share">
            <div v-show="isShowImg" ref="imgContainerRef"></div>
        </Transition>
    </Overlay>
    <div class="hidden share-card" ref="hiddenRef">
        <div class="content">{{ showText }}</div>
        <div
            style="
                display: flex;
                justify-content: flex-end;
                align-items: center;
                padding: 20px;
            "
        >
            <img height="30" width="30" :src="webSiteInfo.icon" />
        </div>
        <div class="info">
            <div class="text">
                <div class="title">{{ webSiteInfo.title }}</div>
                <div class="desc">
                    {{ webSiteInfo.description }}
                </div>
            </div>
            <img height="60" width="60" :src="qrcodeUrl" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.skeleton {
    width: 400px;
    height: 440px;
    overflow: hidden;
    background-color: #f7f7f7;
    z-index: 0;
    position: relative;

    &::after {
        position: absolute;
        top: 0;
        inset-inline-end: -150%;
        bottom: 0;
        inset-inline-start: -150%;
        background: linear-gradient(
            120deg,
            rgba(0, 0, 0, 0.06) 25%,
            rgba(0, 0, 0, 0.15) 37%,
            rgba(0, 0, 0, 0.06) 63%
        );
        animation-name: skeleton-loading;
        animation-duration: 1.4s;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
        content: '';
    }
}

@keyframes skeleton-loading {
    0% {
        transform: translateX(-37.5%);
    }

    100% {
        transform: translateX(37.5%);
    }
}

.share-card {
    width: 400px;
    height: auto;
    box-sizing: border-box;
    background-color: #fff;
    position: absolute;
    z-index: 999;
    font-family: PingFangSC, Open Sans, Helvetica Neue, Arial,
            Hiragino Sans GB, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;

    .content {
        padding: 35px 20px 20px 20px;
        font-size: 18px;
        color: #000;
        font-weight: 500;
        white-space: pre-line;
    }

    .info {
        padding: 10px 20px;
        background-color: rgb(244, 244, 244);
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .text {
            display: flex;
            flex-flow: column nowrap;
            align-items: start;
            color: #000;
            width: 200px;
            line-height: 1.5;
            word-break: break-all;
            
            .title {
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 5px;
            }

            .desc {
                font-weight: 400;
                font-size: 12px;
                color: #9e9e9e;
            }
        }
    }
}

.share-enter-active,
.share-leave-active {
    transition: all 0.2s linear;
}

.share-enter-from,
.share-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.hidden {
    display: none;
}
</style>
