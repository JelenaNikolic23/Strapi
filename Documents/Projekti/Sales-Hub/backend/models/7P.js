const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Evaluation7PSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  evaluation_seen: {
    type: Boolean,
    default: false,
  },
  evaluation: {
    score: {
      type: Number,
      required: true,
    },
    categories: [
      {
        categoryName: {
          type: String,
          required: true,
        },
        categoryWeight: {
          type: Number,
          required: true,
        },
        categoryScore: {
          type: Number,
          required: true,
        },
        categorySteps: [
          {
            stepName: {
              type: String,
              required: true,
            },
            stepWeight: {
              type: Number,
              required: true,
            },
            stepScore: {
              type: Number,
              required: true,
            },
            stepValue: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
    feedback: {
      type: String,
      required: false,
    },
    feedbackReply: {
      type: String,
      required: false,
    },
  },
  user: {
    frontline_id: {
      type: Number,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    group_name: {
      type: String,
      required: true,
    },
    group_id: {
      type: Number,
      required: true,
    },
    group_nest_left: {
      type: Number,
      required: true,
    },
    group_nest_right: {
      type: Number,
      required: true,
    },
    group_nest_depth: {
      type: Number,
      required: true,
    },
    group_parent_id: {
      type: Number,
      required: true,
    },
  },
  evaluator: {
    frontline_id: {
      type: Number,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    frontline_groups: [
      {
        id: {
          type: Number,
          required: false,
        },
        name: {
          type: String,
          required: false,
        },
        active: {
          type: Number,
          required: false,
        },
        nest_left: {
          type: Number,
          required: false,
        },
        nest_right: {
          type: Number,
          required: false,
        },
        nest_right: {
          type: Number,
          required: false,
        },
        nest_depth: {
          type: Number,
          required: false,
        },
        parent_id: {
          type: Number,
          required: false,
        },
      },
    ],
  },
});

module.exports = Evaluation7P = mongoose.model(
  "evaluations7p",
  Evaluation7PSchema
);
