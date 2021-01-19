/**
 * This file is part of Techno Genesis Softwre Solutions.
 *
 * Copyright (c) 2019 Cretu Eusebiu <info@technogenesis.in>
 */

var Camera = function () {
  return {
    options: {
      constraints: {},
      flipHorizontal: true,
      selectors: {
        container: "#camera-modal",
        show: ".open-cam-btn",
        hide: ".camera-hide",
        capture: ".camera-capture",
        preview: ".camera-preview",
      },
    },

    messages: {
      cameraError: "Could not access the camera.",
      cameraFallback: "Your browser does not support the camera feature.",
    },

    /**
     * Camera capture handler.
     *
     * @param {Object} e
     * @param {Object} data
     */
    cameracapture: function (e, data) {
      // this.hide();
      // return data;
    },

    /**
     * Camera success handler.
     *
     * @param {Object} e
     * @param {MediaStream} stream
     */
    camerasuccess: function (e, stream) {
      var camera = this;
      camera.stream = stream;
      if ("srcObject" in camera.video[0]) {
        camera.video[0].srcObject = stream;
      } else {
        camera.video.attr("src", window.URL.createObjectURL(stream));
      }

      // Enable capture button when video is loaded.
      camera.video.on("loadedmetadata", function () {
        camera.options.captureBtn.prop("disabled", false);
      });

      // Flip video preview if necessary.
      if (camera.options.flipHorizontal) {
        camera.flipHorizontal();
      }
    },

    /**
     * Camera error handler.
     *
     * @param {Object} e
     * @param {Object} error
     */
    cameraerror: function (e, error) {
      alert(error);
      this.hide();
    },

    /**
     * Camera fallback handler.
     *
     * @param {Object} e
     * @param {String} message
     */
    camerafallback: function (e, message) {
      alert(message);
    },

    /**
     * Initialize.
     */
    init: function (newOptions) {
      this.options = $.extend(true, this.options, newOptions);
      this.initOptions();
      this.initHandlers();
    },

    /**
     * Initialize options.
     */
    initOptions: function () {
      var o = this.options;
      var s = this.options.selectors;

      this.mediaDevices = this.getMediaDevices();

      if (!o.container) {
        o.container = $(s.container);
      }

      if (!o.container) {
        return false;
      }

      if (!o.showBtn) {
        o.showBtn = $(document).find(s.show);
      }

      if (!o.hideBtn) {
        o.hideBtn = o.container.find(s.hide);
      }

      if (!o.captureBtn) {
        o.captureBtn = o.container.find(s.capture);
      }

      if (!o.preview) {
        o.preview = o.container.find(s.preview);
      }

      o.captureBtn.prop("disabled", true);
    },

    /**
     * Initialize event handlers.
     */
    initHandlers: function () {
      var _this = this;

      var o = this.options;
      var s = this.options.selectors;
      $(document).on(s.show, "click", this.show);
      $(document).on(s.hide, "click", this.hide);
      $(document).on(s.capture, "click", this.capture);

      if (this.isModal()) {
        o.container
          .on("shown.bs.modal", function () {
            return _this.startStream();
          })
          .on("hidden.bs.modal", function () {
            return _this.hide();
          });
      }
    },

    /**
     * Show camera container / modal.
     */
    show: function (e) {
      if (!this.mediaDevices) {
        return this.camerafallback(e);
      }

      if (this.isModal()) {
        var modelContiner = this.options.container;
        $(modelContiner).modal("show");
      } else {
        $(this.options.container).show();
        this.startStream();
      }
    },

    /**
     * Hide camera container / modal.
     */
    hide: function () {
      if (this.isModal()) {
        $(this.options.container).modal("hide");
      } else {
        $(this.options.container).hide();
      }
      this.stopStream();
    },

    /**
     * Capture image.
     */
    capture: function (e) {
      // var data = { files: [this.getBlob()], autoUpload: true };
      // this.cameracapture(e, data);
      // alert('captured');

      return this.getDataUri();
    },

    /**
     * Start camera video stream.
     */
    startStream: function () {
      var _this2 = this;

      this.video = $("<video autoplay></video>");
      this.options.preview.html(this.video).show();

      this.mediaDevices
        .getUserMedia({
          audio: false,
          video: this.options.constraints,
        })
        .then(function (stream) {
          return _this2.camerasuccess(null, stream);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    /**
     * Stop camera video stream.
     */
    stopStream: function () {
      if (this.stream) {
        if (this.stream.getVideoTracks) {
          var tracks = this.stream.getVideoTracks();
          if (tracks && tracks[0] && tracks[0].stop) {
            tracks[0].stop();
          }
        } else if (this.stream.stop) {
          this.stream.stop();
        }

        delete this.stream;
      }

      if (this.video) {
        this.video.remove();
        delete this.video;
      }
    },

    /**
     * Flip camera preview horizontal.
     */
    flipHorizontal: function () {
      this.options.preview.css({
        transform: "scaleX(-1)",
        mozTransform: "scaleX(-1)",
        webkitTransform: "scaleX(-1)",
      });
    },

    /**
     * Get Blob object from video stream.
     *
     * @return {Blob}
     */
    getBlob: function () {
      var dataUri = this.getDataUri();
      var base64 = dataUri.split("data:image/jpeg;base64,")[1];

      var binary = this.encode(base64);
      var blob = new Blob([binary], { type: "image/jpeg" });
      blob.name = "camera" + Math.round(Math.random() * 1000) + ".jpg";
      blob.lastModifiedDate = new Date();
      $(".inspect_image").attr("src", dataUri);
      return blob;
    },

    /**
     * Get video data url.
     *
     * @return {String}
     */
    getDataUri: function () {
      var canvas = document.createElement("canvas");
      canvas.width = this.video[0].videoWidth;
      canvas.height = this.video[0].videoHeight;
      var context = canvas.getContext("2d");
      if (this.options.flipHorizontal) {
        context.translate(this.video[0].videoWidth, 0);
        context.scale(-1, 1);
      }
      context.drawImage(this.video[0], 0, 0);
      return canvas.toDataURL("image/jpeg");
    },

    /**
     * Detect Bootstrap modal support.
     *
     * @return {Boolean}
     */
    isModal: function () {
      return this.options.container && this.options.container.hasClass("modal");
    },

    /**
     * Get media devices.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
     *
     * @return {MediaDevices|null}
     */
    getMediaDevices: function () {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices;
      }

      return navigator.mozGetUserMedia || navigator.webkitGetUserMedia
        ? {
            getUserMedia: function getUserMedia(constraints) {
              return new Promise(function (resolve, reject) {
                (
                  navigator.mozGetUserMedia || navigator.webkitGetUserMedia
                ).call(navigator, constraints, resolve, reject);
              });
            },
          }
        : null;
    },

    /**
     * Encode base64 string to array buffer.
     *
     * @param  {String}
     * @return {ArrayBuffer}
     */
    encode: function (base64) {
      var bin = atob(base64);
      var len = bin.length;
      var ab = new ArrayBuffer(len);
      var ua = new Uint8Array(ab);
      for (var i = 0; i < len; i++) {
        ua[i] = bin.charCodeAt(i);
      }
      return ab;
    },
  };
};
