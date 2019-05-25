<script>
    export default {
        name: 'Icon{{icon}}',
        serverCacheKey: p => `Icon-{{icon}}:${p.color || 'default'}:${p.width}:${p.height}:${p.className || 'icon'}`,
        props: {
            className: [Object, Array, String],
            width: {
                type: Number,
                'default': 24,
            },
            height: {
                type: Number,
                'default': 24,
            },
            viewBox: {
                type: String,
                'default': '0 0 24 24',
            },
            color: String,
        },
        render (h) {
            const data = {
                staticClass: 'icon icon-{{icon}}',
                'class': this.className,
                attrs: {
                    width: this.width,
                    height: this.height,
                    viewBox: this.viewBox,
                    xmlns: 'http://www.w3.org/2000/svg',
                },
            };

            return h('svg', data, [
                h('path', {
                    attrs: {
                        d: '{{path}}',
                    },
                    style: {
                        fill: this.color,
                    },
                }),
            ]);
        },
    };
</script>
