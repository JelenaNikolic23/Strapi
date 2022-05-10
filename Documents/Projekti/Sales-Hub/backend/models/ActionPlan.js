const mongoose = require("mongoose");

const ActionPlansSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ShopReport"
  },
  challenge: {
    type: String
  },
  resolved: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Date
  },
  actions: [
    {
      task: {
        type: String
      },
      completed: {
        type: Boolean,
        default: false
      }
    }
  ],
  creator: {
    frontline_id: {
      type: Number,
      required: true
    },
    fullname: {
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
  },
  shop: {
    id: {
      type: Number,
      required: true
    },
    fullname: {
      type: String,
      required: true
    },
    nest_left: {
      type: Number,
      required: true
    },
    nest_right: {
      type: Number,
      required: true
    },
    nest_depth: {
      type: Number,
      required: true
    },
    parent_id: {
      type: Number,
      required: true
    },
    parent_name: {
      type: String,
      required: true
    }
  }
});

const ActionPlans = mongoose.model("ActionPlan", ActionPlansSchema);

module.exports = ActionPlans;
