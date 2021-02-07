<template>
  <main class="main p-4">
    <section class="card w-2/3 mx-auto">
      <header class="card-header">
        Chargez le fichier zip reçu de "Réseaux et canalisations"
      </header>
      <section class="card-body">
        <DropFile @upload="upload" />
      </section>
    </section>
  </main>
  <aside class="aside">
    <h2 class="h2">Comment ça marche ?</h2>
    <h3 class="h3"><span class="numero">1</span>Créer une demande</h3>
    <ol class="list-decimal pl-4 py-3">
      <li>Créer un compte sur <a href="https://www.reseaux-et-canalisations.ineris.fr/gu-presentation/front/inscriptionupdate.action">Réseaux et canalisations</a>.</li>
      <li>Tracer l'emprise des travaux sur le <a href="https://www.reseaux-et-canalisations.ineris.fr/gu-presentation/outils/tracer-votre-emprise-de-chantier.html">service en ligne</a>.</li>
      <li>Préparer la demande de travaux en cliquant sur Préparer mon dossier.</li>
      <li>Remplir le formulaire de la demande.</li>
    </ol>
    <h3 class="h3"><span class="numero">2</span>Chargez le dossier de demande ici</h3>
    <p>Vous allez recevoir un email avec un fichier zip en pièce jointe. <DropFileLink @upload="upload">Chargez ce fichier ici</DropFileLink>.</p>
    <h3 class="h3"><span class="numero">3</span>Configurez l'adresse de réponse</h3>
    <p>Il s'agit de votre adresse email pour que les exploitants puissent vous répondre directement.</p>
    
    <h3 class="h3"><span class="numero">4</span>Configurez le texte à envoyer</h3>
    <h3 class="h3"><span class="numero">5</span>Validez !</h3>
    <p>Et nous envoyons votre demande à tous les exploitants concernés, à votre place.</p>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DropFile from '../components/drop/DropFile.vue';
import DropFileLink from '../components/drop/DropFileLink.vue';

export default defineComponent({
  name: 'App',
  components: {
    DropFile,
    DropFileLink,
  },
  emits: ['uploaded'],
  methods: {
    upload(file: any) {
      this.$emit('uploaded', file);
    },
  },
});
</script>
