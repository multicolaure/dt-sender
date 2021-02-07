<template>
    <div class="bg-black bg-opacity-60 fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center">
        <section class="card w-1/3">
            <header class="card-header flex justify-between">
                <span class="space-x-3" :class="textClass">
                    <Icon v-if="icon" :name="icon" />
                    <span>{{ title }}</span>
                </span>
                <button @click="close">
                    <Icon name="close" />
                </button>
            </header>
            <div class="card-body">
                {{ message }}
            </div>
            <section class="card-footer flex justify-end space-y-3">
                <button class="btn" :class="btnClass" @click="ok">{{ okButton }}</button>
            </section>
        </section>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Icon from '../Icon.vue';

export enum ModalType {
    INFO,
    ERROR,
    SUCCESS,
    LOADING,
}

export default defineComponent({
    name: 'Modal',
    components: {
        Icon,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: Number as PropType<ModalType>,
            required: true,
        },
        okButton: {
            type: String,
            required: true,
        }
    },
    emits: ['close', 'ok'],
    data() {
        return {
            ModalType
        };
    },
    computed: {
        icon() {
            switch(this.type) {
                case ModalType.INFO: {
                    return 'info';
                }
                case ModalType.LOADING: {
                    return 'spinner';
                }
                case ModalType.ERROR: {
                    return 'error';
                }
                case ModalType.SUCCESS: {
                    return 'check';
                }
            }
            return null;
        },
        textClass() {
            switch(this.type) {
                case ModalType.ERROR: {
                    return 'text-failure';
                }
                case ModalType.SUCCESS: {
                    return 'text-success';
                }
            }
            return 'text-primary';
        },
        btnClass() {
            switch(this.type) {
                case ModalType.ERROR: {
                    return 'btn-failure';
                }
                case ModalType.SUCCESS: {
                    return 'btn-success';
                }
            }
            return 'btn-primary';
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        ok() {
            this.$emit('ok');
        }
    }
});
</script>