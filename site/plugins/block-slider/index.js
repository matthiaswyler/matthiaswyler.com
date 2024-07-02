panel.plugin("wym/block-slider", {
	blocks: {
		slider: {
			computed: {
				media() {
					if (this.content.media[0]) {
						return this.content.media[0].url;
					}
					return false;
				},
			},
			template: `
        <template>
          <ul @dblclick="open" v-if="media">
            <li v-for="media in content.media">
              <img v-if="media.type === 'image'" :src="media.url">
              <video v-else-if="media.type === 'video'">
                <source :src="media.url">
              </video>
            </li>
          </ul>
          <figure @click="open" v-else class="k-block-figure"><button class="k-block-figure-empty k-button" type="button"><span aria-hidden="true" class="k-button-icon k-icon k-icon-image"><svg viewBox="0 0 16 16"><use xlink:href="#icon-image"></use></svg></span><span class="k-button-text">Bilder auswählen...</span></button></figure>
        </template>
      `,
		},
	},
});
