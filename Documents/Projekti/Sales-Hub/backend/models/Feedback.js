const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
    required: true
  },
  score: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  fileScan: {
    type: String
  },
  user: {
    frontline_id: {
      type: Number,
      required: true
    },
    fullname: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    group_name: {
      type: String,
      required: true
    },
    group_id: {
      type: Number,
      required: true
    },
    group_nest_left: {
      type: Number,
      required: true
    },
    group_nest_right: {
      type: Number,
      required: true
    },
    group_nest_depth: {
      type: Number,
      required: true
    },
    group_parent_id: {
      type: Number,
      required: true
    }
  },
  evaluator: {
    frontline_id: {
      type: Number,
      required: true
    },
    fullname: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    frontline_groups: [
      {
        id: {
          type: Number,
          required: false
        },
        name: {
          type: String,
          required: false
        },
        active: {
          type: Number,
          required: false
        },
        nest_left: {
          type: Number,
          required: false
        },
        nest_right: {
          type: Number,
          required: false
        },
        nest_right: {
          type: Number,
          required: false
        },
        nest_depth: {
          type: Number,
          required: false
        },
        parent_id: {
          type: Number,
          required: false
        }
      }
    ]
  }
});

module.exports = Feedback = mongoose.model("feedbacks", FeedbackSchema);
