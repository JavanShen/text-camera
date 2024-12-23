<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import html2canvas from 'html2canvas'
import Overlay from './components/Overlay.ce.vue'
import QRcode from 'qrcode'
import { getWebsiteInfo } from './utils/info'
import { cutText } from './utils/text'

const imgContainerRef = ref<HTMLElement>()
const hiddenRef = ref<HTMLElement>()

const qrcodeUrl = ref<string>()
const showText = ref<string>()
const isShowModal = ref(false)

const webSiteInfo = ref(getWebsiteInfo())

watch(isShowModal, val => {
    if (!val) {
        imgContainerRef.value?.replaceChildren()
    }
})

const showPopup = async (selectedText: string) => {
    isShowModal.value = true
    await nextTick()

    webSiteInfo.value = getWebsiteInfo()
    await nextTick()

    QRcode.toDataURL(webSiteInfo.value.url, async (_, url) => {
        showText.value = selectedText
        qrcodeUrl.value = url

        await nextTick()

        if (hiddenRef.value) {
            html2canvas(hiddenRef.value, {
                allowTaint: true,
                onclone: (_, el) => {
                    el.style.display = 'block'
                }
            }).then(canvas => {
                canvas.style.boxShadow = '0px 2px 13px 4px #aaaaaa99'
                imgContainerRef.value?.replaceChildren(canvas)
            })
        }
    })
}

chrome.runtime.onMessage.addListener(res => {
    showPopup(res.text)
})
</script>

<template>
    <Overlay v-model:visible="isShowModal">
        <div ref="imgContainerRef"></div>
    </Overlay>
    <div class="hidden share-card" ref="hiddenRef">
        <div class="content">{{ showText }}</div>
        <div style="display: flex; justify-content: flex-end; align-items: center; padding: 20px;">
            <img height="30" width="30" :src="webSiteInfo.icon" />
        </div>
        <div class="info">
            <div class="text">
                <div class="title">{{ webSiteInfo.title }}</div>
                <div class="desc">{{ cutText(webSiteInfo.description || '')  }}</div>
            </div>
            <img height="60" width="60" :src="qrcodeUrl" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.share-card {
    width: 400px;
    height: auto;
    box-sizing: border-box;
    background-color: #fff;
    position: absolute;
    z-index: 999;

    .content {
        padding: 35px 20px 20px 20px;
        font-size: 18px;
        color: #000;
        font-family: PingFangSC, Open Sans, Helvetica Neue, Arial,
            Hiragino Sans GB, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;
        font-weight: 500;
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
            font-size: 14px;
            color: #000;
            width:200px;
            line-height: 1.5;

            .title {
                font-weight: 500;
                margin-bottom: 5px;
            }

            .desc {
                font-size: 12px;
                color: #9e9e9e;
            }
        }
    }
}

.hidden {
    display: none;
}
</style>
