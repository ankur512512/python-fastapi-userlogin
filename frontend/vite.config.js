import react from "@vitejs/plugin-react";

export default {
  plugins: [react()],
  server: {
    port: 5173,  // Frontend will run on this port
    allowedHosts: true,
    hmr: {
      overlay: false, // Disable the error overlay
    },
  },
};
