<template>
<FontAwesomeIcon :icon="icon" :spin="spinning" :size="size" :key="name"/>
</template>

<script lang="ts">

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCloudDownloadAlt, faTimes, faCheck, faExclamationCircle, faInfo, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {defineComponent} from 'vue';

const ICONS: { [iconName: string]: IconDefinition } = {
    dropfile: faCloudDownloadAlt,
    check: faCheck,
    close: faTimes,
    error: faExclamationCircle,
    info: faInfo,
    spinner: faSpinner,
    github: faGithub
}

export default defineComponent({
    components: {
        FontAwesomeIcon,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            default: "sm",
        }
    },
    computed: {
        icon():IconDefinition {
            return ICONS[this.name];
        },
        spinning():boolean {
            return this.name === 'spinner';
        }
    }
});

</script>
