<template>
    <Spin :spinning="isSetting">
        <div class="container">
            <List class="options">
                <ListItem class="option-item">
                    <Space>
                        <LinkOutlined />
                        <span>{{ i18nText.parseLinkTitle }}</span>
                    </Space>
                    <Switch
                        :loading="isSetting"
                        v-model:checked="options.isParseLink"
                    />
                </ListItem>
            </List>
        </div>
    </Spin>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { List, ListItem, Space, Spin, Switch } from 'ant-design-vue'
import { LinkOutlined } from '@ant-design/icons-vue'

const i18nText = {
    parseLinkTitle: chrome.i18n.getMessage('parseLinkOptTitle')
}

const isSetting = ref(false)
const isReading = ref(true)

const options = ref({
    isParseLink: false
})

onBeforeMount(() => {
    chrome.storage.local
        .get('options')
        .then(val => {
            console.log(val)
            if (val?.options) {
                options.value = { ...options.value, ...val.options }
            }
        })
        .finally(() => {
            isReading.value = false
        })
})

watch(
    options,
    val => {
        isSetting.value = true
        chrome.storage.local
            .set({
                options: { ...val }
            })
            .finally(() => {
                isSetting.value = false
            })
    },
    {
        deep: true
    }
)
</script>

<style scoped lang="scss">
.container {
    padding: 20px;

    .options {
        width: 250px;

        .option-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
}
</style>
