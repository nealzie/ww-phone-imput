<template>
  <div class="ww-phone-input" :class="{ 'ww-phone-input--dark': properties.darkMode }">
    <MazPhoneNumberInput
      v-model="model"
      v-model:country-code="countryCode"
      :show-code-on-list="properties.showCodeOnList"
      :preferred-countries="properties.preferredCountries"
      :translations="properties.translations"
      :country-locale="properties.countryLocale"
      :auto-format="properties.autoFormat"
      :orientation="properties.orientation"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import { MazPhoneNumberInput } from 'maz-ui'
import '@maz-ui/components/modules/maz-phone-number-input/MazPhoneNumberInput.css'

export default {
  name: 'PhoneInput',
  components: {
    MazPhoneNumberInput,
  },
  emits: ['trigger'],
  props: {
    // WeWeb component configuration
    properties: {
      type: Object,
      default: () => ({
        darkMode: false,
        showCodeOnList: true,
        preferredCountries: ['US', 'GB', 'CA', 'FR', 'DE'],
        translations: {
          countrySelector: {
            placeholder: 'Country code',
            error: 'Choose country',
            searchPlaceholder: 'Search a country',
          },
          phoneInput: {
            placeholder: 'Phone number',
            example: 'Example:',
          },
        },
        countryLocale: 'en-US',
        autoFormat: true,
        orientation: 'responsive',
      }),
    },
    model: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      countryCode: 'US',
    }
  },
  methods: {
    handleUpdate(data) {
      this.$emit('trigger', {
        phoneNumber: this.model,
        countryCode: this.countryCode,
        ...data,
      })
    },
  },
}
</script>

<style>
.ww-phone-input {
  font-family: var(--ww-font-family, sans-serif);
  max-width: 100%;
  margin: 0 auto;
}

.ww-phone-input--dark {
  --maz-color-bg: #1a1a1a;
  --maz-color-bg-light: #2a2a2a;
  --maz-color-text: #ffffff;
}

/* Override Maz UI styles */
.ww-phone-input :deep(.maz-phone-number-input) {
  --maz-font-family: var(--ww-font-family, sans-serif) !important;
}

.ww-phone-input :deep(input),
.ww-phone-input :deep(button),
.ww-phone-input :deep(.maz-select__options) {
  font-family: var(--ww-font-family, sans-serif) !important;
}
</style>
