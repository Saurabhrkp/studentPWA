var Photo = require('../models/photo');
var Pdf = require('../models/pdf');
var Text = require('../models/text');
var Type = require('../models/type');

// Load User model
let User = require('../models/user');

var async = require('async');

// Display detail page for a specific Photo.
exports.photo_detail = function(req, res, next) {
  async.parallel(
    {
      photo: function(callback) {
        Photo.findById(req.params.id)
          .populate('_user')
          .populate('_type')
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.photo == null) {
        // No results.
        var err = new Error('Photo not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('./details/photo', {
        current: 'Photo',
        photo: results.photo,
        user: req.user
      });
    }
  );
};

exports.photo_download = function(req, res, next) {
  async.parallel(
    {
      photo: function(callback) {
        Photo.findById(req.params.id, ['path']).exec(callback);
      }
    },
    function(err, result) {
      if (err) {
        return next(err);
      }
      if (result.photo == null) {
        // No results.
        var err = new Error('Photo not found');
        err.status = 404;
        return next(err);
      }
      Url = result.photo.path;
      res.download(`./uploads/${Url}`);
    }
  );
};

// Display detail page for a specific Pdf.
exports.pdf_detail = function(req, res, next) {
  async.parallel(
    {
      pdf: function(callback) {
        Pdf.findById(req.params.id)
          .populate('_user')
          .populate('_type')
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.pdf == null) {
        // No results.
        var err = new Error('Pdf not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('./details/pdf', {
        current: 'Pdf',
        pdf: results.pdf,
        user: req.user
      });
    }
  );
};

// Display detail page for a specific Pdf.
exports.post_detail = function(req, res, next) {
  async.parallel(
    {
      post: function(callback) {
        Text.findById(req.params.id)
          .populate('_user')
          .populate('_type')
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.post == null) {
        // No results.
        var err = new Error('Pdf not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('./details/post', {
        current: 'Post',
        post: results.post,
        user: req.user
      });
    }
  );
};

// Display detail page for a specific Pdf.
exports.document = function(req, res, next) {
  async.parallel(
    {
      photoDoc: function(callback) {
        Photo.find({ _type: '5cb2db77ef58e46ad681be94' })
          .populate('_user')
          .populate('_type')
          .exec(callback);
      },
      pdfDoc: function(callback) {
        Pdf.find({ _type: '5cb2db77ef58e46ad681be94' })
          .populate('_user')
          .populate('_type')
          .exec(callback);
      },
      postDoc: function(callback) {
        Text.find({ _type: '5cb2db77ef58e46ad681be94' })
          .populate('_user')
          .populate('_type')
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results == null) {
        // No results.
        var err = new Error('Not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('./details/document', {
        current: 'document',
        photos: results.photoDoc,
        pdfs: results.pdfDoc,
        posts: results.postDoc,
        user: req.user
      });
    }
  );
};

// Display detail page for a specific Pdf.
exports.notice = function(req, res, next) {
  async.parallel(
    {
      photoNoti: function(callback) {
        Photo.find({ _type: '5cb2db55ef58e46ad681be7e' })
          .populate('_user')
          .populate('_type')
          .exec(callback);
      },
      pdfNoti: function(callback) {
        Pdf.find({ _type: '5cb2db55ef58e46ad681be7e' })
          .populate('_user')
          .populate('_type')
          .exec(callback);
      },
      postNoti: function(callback) {
        Text.find({ _type: '5cb2db55ef58e46ad681be7e' })
          .populate('_user')
          .populate('_type')
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results == null) {
        // No results.
        var err = new Error('Not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('./details/notice', {
        current: 'notice',
        photos: results.photoNoti,
        pdfs: results.pdfNoti,
        posts: results.postNoti,
        user: req.user
      });
    }
  );
};

exports.photo_delete = function(req, res, next) {
  async.parallel(
    {
      photo: function(callback) {
        Photo.findById(req.params.id)
          .populate('_user')
          .populate('_type')
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.photo == null) {
        // No results.
        res.redirect('/account');
      }
      // Successful, so render.
      res.render('./details/delete', {
        current: 'delete',
        item: results.photo,
        user: results.user
      });
    }
  );
};

exports.photo_delete_post = function(req, res, next) {
  const ID = req.params.id;
  const UserID = req.user.id;
  async.parallel({}, function(err, results) {
    if (err) {
      return next(err);
    } else {
      User.findOneAndUpdate(UserID, { $pull: { photos: ID } }, function(err) {
        if (err) {
          return res.status(500).json({ error: 'error in deleting address' });
        }
      });
      Photo.findOneAndDelete(
        req.body.id,
        function deletephoto(err) {
          if (err) {
            return next(err);
          }
          res.redirect('/account');
        },
        console.log(`Deleted from photos`)
      );
    }
  });
};

exports.pdf_delete = function(req, res, next) {
  async.parallel(
    {
      pdf: function(callback) {
        Pdf.findById(req.params.id)
          .populate('_user')
          .populate('_type')
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.pdf == null) {
        // No results.
        res.redirect('/account');
      }
      res.render('./details/delete', {
        current: 'delete',
        item: results.pdf,
        user: results.user
      });
    }
  );
};

exports.pdf_delete_post = function(req, res, next) {
  const ID = req.params.id;
  const UserID = req.user.id;
  async.parallel({}, function(err, results) {
    if (err) {
      return next(err);
    } else {
      User.findOneAndUpdate(UserID, { $pull: { pdfs: ID } }, function(err) {
        if (err) {
          return res.status(500).json({ error: 'error in deleting address' });
        }
      });
      Pdf.findOneAndDelete(
        req.body.id,
        function deletepdf(err) {
          if (err) {
            return next(err);
          }
          res.redirect('/account');
        },
        console.log(`Deleted from pdfs`)
      );
    }
  });
};

exports.text_delete = function(req, res, next) {
  async.parallel(
    {
      text: function(callback) {
        Text.findById(req.params.id)
          .populate('_user')
          .populate('_type')
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.text == null) {
        // No results.
        res.redirect('/account');
      }
      res.render('./details/delete', {
        current: 'delete',
        item: results.text,
        user: results.user
      });
    }
  );
};

exports.text_delete_post = function(req, res, next) {
  const ID = req.params.id;
  const UserID = req.user.id;
  async.parallel({}, function(err, results) {
    if (err) {
      return next(err);
    } else {
      User.findOneAndUpdate(UserID, { $pull: { texts: ID } }, function(err) {
        if (err) {
          return res.status(500).json({ error: 'error in deleting address' });
        }
      });
      Text.findOneAndDelete(
        req.body.id,
        function deletepdf(err) {
          if (err) {
            return next(err);
          }
          res.redirect('/account');
        },
        console.log(`Deleted from pdfs`)
      );
    }
  });
};
