// vite.config.mts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/Users/AMONTALVO/Documents/Tecnolog%C3%ADa%20Pr%C3%A1ctica/Proyectos/leonprodiesel/frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Users/AMONTALVO/Documents/Tecnolog%C3%ADa%20Pr%C3%A1ctica/Proyectos/leonprodiesel/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///D:/Users/AMONTALVO/Documents/Tecnolog%C3%ADa%20Pr%C3%A1ctica/Proyectos/leonprodiesel/frontend/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/Users/AMONTALVO/Documents/Tecnolog%C3%ADa%20Pr%C3%A1ctica/Proyectos/leonprodiesel/frontend/vite.config.mts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueDevTools({
      launchEditor: "code"
    })
  ],
  resolve: {
    alias: {
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  // base: "/metronic8/vue/demo1/",
  // base: "/",
  build: {
    chunkSizeWarningLimit: 3e3
  },
  server: {
    port: 5183
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcQU1PTlRBTFZPXFxcXERvY3VtZW50c1xcXFxUZWNub2xvZ1x1MDBFRGEgUHJcdTAwRTFjdGljYVxcXFxQcm95ZWN0b3NcXFxcbGVvbnByb2RpZXNlbFxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcQU1PTlRBTFZPXFxcXERvY3VtZW50c1xcXFxUZWNub2xvZ1x1MDBFRGEgUHJcdTAwRTFjdGljYVxcXFxQcm95ZWN0b3NcXFxcbGVvbnByb2RpZXNlbFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL0FNT05UQUxWTy9Eb2N1bWVudHMvVGVjbm9sb2clQzMlQURhJTIwUHIlQzMlQTFjdGljYS9Qcm95ZWN0b3MvbGVvbnByb2RpZXNlbC9mcm9udGVuZC92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tIFwibm9kZTp1cmxcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIHZ1ZSgpLFxuICAgICAgICB2dWVEZXZUb29scyh7XG4gICAgICAgICAgICBsYXVuY2hFZGl0b3I6ICdjb2RlJ1xuICAgICAgICB9KSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgIFwidnVlLWkxOG5cIjogXCJ2dWUtaTE4bi9kaXN0L3Z1ZS1pMThuLmNqcy5qc1wiLFxuICAgICAgICAgICAgXCJAXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgLy8gYmFzZTogXCIvbWV0cm9uaWM4L3Z1ZS9kZW1vMS9cIixcbiAgICAvLyBiYXNlOiBcIi9cIixcbiAgICBidWlsZDoge1xuICAgICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDMwMDAsXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgcG9ydDogNTE4M1xuICAgIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtYyxTQUFTLGVBQWUsV0FBVztBQUN0ZSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxpQkFBaUI7QUFIa1EsSUFBTSwyQ0FBMkM7QUFNM1UsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsSUFBSTtBQUFBLElBQ0osWUFBWTtBQUFBLE1BQ1IsY0FBYztBQUFBLElBQ2xCLENBQUM7QUFBQSxFQUNMO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxZQUFZO0FBQUEsTUFDWixLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3hEO0FBQUEsRUFDSjtBQUFBO0FBQUE7QUFBQSxFQUdBLE9BQU87QUFBQSxJQUNILHVCQUF1QjtBQUFBLEVBQzNCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsRUFDVjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
