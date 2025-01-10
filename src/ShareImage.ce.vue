<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import html2canvas from 'html2canvas-pro'
import Overlay from './components/Overlay.ce.vue'
import QRcode from 'qrcode'
import { getWebsiteInfo } from './utils/info'
import { cutText, extractLink, separateParagraphs } from './utils/text'

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

const showPopup = async (selectedText: string, el?: DocumentFragment) => {
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
        const storage = await chrome.storage.local.get('options')
        showText.value = separateParagraphs(
            storage?.options?.isParseLink ? extractLink(el, selectedText) : selectedText
        )
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
    const range = window.getSelection()?.getRangeAt(0)
    showPopup(range?.toString() || res.text, range?.cloneContents())
})
</script>

<template>
    <Overlay v-model:visible="isShowModal">
        <Transition name="share">
            <div v-show="isShowImg" ref="imgContainerRef"></div>
        </Transition>
    </Overlay>
    <div class="text-camera-hidden text-camera-card" ref="hiddenRef">
        <div class="text-camera-content">{{ showText }}</div>
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
        <div class="text-camera-info">
            <div class="text-camera-text">
                <div class="text-camera-title">{{ webSiteInfo.title }}</div>
                <div class="text-camera-desc">
                    {{ webSiteInfo.description }}
                </div>
            </div>
            <img height="60" width="60" :src="qrcodeUrl" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.text-camera-card {
    width: 400px;
    height: auto;
    box-sizing: border-box;
    background-color: #fff;
    position: absolute;
    z-index: 999;
    font-family: PingFangSC, Open Sans, Helvetica Neue, Arial, Hiragino Sans GB,
        Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;

    .text-camera-content {
        padding: 35px 20px 20px 20px;
        font-size: 18px;
        color: #000;
        font-weight: 500;
        white-space: pre-line;
        word-break: break-all;
    }

    .text-camera-info {
        padding: 10px 20px;
        background-color: rgb(244, 244, 244);
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .text-camera-text {
            display: flex;
            flex-flow: column nowrap;
            align-items: start;
            color: #000;
            width: 200px;
            line-height: 1.5;
            word-break: break-all;

            .text-camera-title {
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 5px;
            }

            .text-camera-desc {
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

.text-camera-hidden {
    display: none;
}
</style>
