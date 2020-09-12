<template>
  <div class="dox-modal-mask">
    <div class="dox-modal-wrapper">
      <div
        @keyup.esc="$emit('close')"
        v-click-outside="() => $emit('close')"
        class="dox-modal-container">
        <div class="dox-modal-header">
          <slot name="header">
            default header
          </slot>
        </div>

        <div class="dox-modal-body">
          <slot name="body">
            default body
          </slot>
        </div>

        <div class="dox-modal-footer">
          <slot name="footer">
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';

export default {
  directives: {
    ClickOutside,
  },
  methods: {
    onEsc(e) {
      if (e.keyCode === 27) {
        this.$emit('close');
      }
    },
  },
  mounted() {
    document.body.addEventListener('keyup', this.onEsc);
  },
  unmounted() {
    document.body.removeEventListener('keyup', this.onEsc);
  },
};
</script>

<style>
.dox-modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .1);
  display: table;
  transition: opacity .3s ease;
}

.dox-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.dox-modal-container {
  max-width: 500px;
  margin: 0px auto;
  padding: 25px 30px;
  background-color: #fafafa;
  border-radius: 8px;
  box-shadow: 0 3px 9px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: 'Montserrat', sans-serif;
}

.dox-modal-header h3 {
  margin-top: 10;
}

.dox-modal-body {
  margin: 30px 0;
}

.dox-modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.dox-modal-enter {
  opacity: 0;
}

.dox-modal-leave-active {
  opacity: 0;
}

.dox-modal-enter .dox-modal-container,
.dox-modal-leave-active .dox-modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
