(function ($) {
  Drupal.media_crop = Drupal.media_crop || {};

  Drupal.media_crop.replaceImage = function (replaceData) {

    var id = replaceData.id;
    var options = replaceData.options;
    var token = replaceData.token;
    var fid = replaceData.fid;

    $.ajax({

      cache: false,

      success: function (data) {

        var mciid = '%7BMCIID%7D';
        var img = $('#' + id);

        if (img.length === 0) {
          $('iframe').each(function () {
            // There can be iframes from other domains on the page.
            try {
              var iimg = $(this).contents().find('#' + id);
              if (iimg.length > 0) {
                img = iimg;
              }
            }
            catch (e) {}
          });
        }

        var src = (img.attr('src') || '');
        var dataCkeSavedSrc = (img.attr('data-cke-saved-src') || '');
        var cls = (img.attr('class') || '');
        var info = {"fid" : fid, "view_mode" : "media_crop", "type" : "media"};

        // Append the info we get back from media crop.
        jQuery.each(data, function(i, v) {
          info[i] = v;
        });

        img.attr('src', src.replace(mciid, data.mciid));
        img.attr('data-cke-saved-src', dataCkeSavedSrc.replace(mciid, data.mciid));
        img.attr('data-file_info', encodeURI(JSON.stringify(info)));

        img.load(function(){
          var me = $(this);
          me.attr('height', me.height());
          me.attr('width', me.width());
        });

        img.addClass('mciid-' + data.mciid);

      },

      error: function (jqXHR, textStatus, errorThrown) {
        if (parent.console && parent.console.log) {
          parent.console.log(jqXHR, textStatus, errorThrown);
        }
      },

      type: 'POST',

      url: Drupal.settings.basePath + 'media_crop/' +
           options.media_crop_image_style + '/' +
           fid + '/' +
           token,

      data: {
        media_crop: {
          angle: options.media_crop_rotate,
          w: options.media_crop_w,
          h: options.media_crop_h,
          x: options.media_crop_x,
          y: options.media_crop_y,
          scale_w: options.media_crop_scale_w,
          scale_h: options.media_crop_scale_h
        }
      }

    });
  };
})(jQuery);
