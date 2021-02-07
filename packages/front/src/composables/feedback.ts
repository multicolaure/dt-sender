import { ref } from 'vue';
import { ModalType } from '../components/feedback/Modal.vue';


export default function useFeedbacks() {

  const modalOpen = ref(false);
  const modalMessage = ref('');
  const modalType = ref(ModalType.INFO as ModalType);
  const modalTitle = ref('');
  const modalOkButton = ref('Ok');

  const startLoading = () => {
    modalOpen.value = true;
    modalMessage.value = 'Veuillez patienter, nous envoyons vos emails...';
    modalType.value = ModalType.LOADING;
    modalTitle.value = "Envoi en cours...";
    modalOkButton.value = 'Fermer';
  };
  const success = () => {
    modalOpen.value = true;
    modalMessage.value = 'Les emails ont bien été envoyés !';
    modalType.value = ModalType.SUCCESS;
    modalTitle.value = "C'est fait !";
    modalOkButton.value = 'Recommencer';
  };
  const handleError = () => {
    modalOpen.value = true;
    modalMessage.value = 'Hum, quelque chose n\'a pas marché cette fois-ci. Réessayez !';
    modalType.value = ModalType.ERROR;
    modalTitle.value = "Oups";
    modalOkButton.value = 'Réessayer';
  };
  const closeModal = () => {
    modalOpen.value = false;
  };

  return {
    modalOpen,
    modalMessage,
    modalType,
    modalTitle,
    modalOkButton,
    startLoading,
    success,
    handleError,
    closeModal
  }
}
