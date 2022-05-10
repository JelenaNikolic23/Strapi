const mongoose = require("mongoose");

const ShopReportSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  evaluation: {
    score: {
      type: Number
      //required: true
    },
    categories: [
      {
        categoryName: {
          type: String,
          required: true
        },
        categoryWeight: {
          type: Number
          //required: true
        },
        categoryScore: {
          type: Number
          //required: true
        },
        categorySteps: [
          {
            stepName: {
              type: String,
              required: true
            },
            stepWeight: {
              type: Number
              //required: true
            },
            stepScore: {
              type: Number
              //required: true
            },
            stepValue: {
              type: String,
              required: true
            }
          }
        ],
        categoryComment: {
          type: String
        }
      }
    ],
    ProdajniPristup: {
      evaluation5G: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evaluation",
        required: true
      },
      categorySteps: [
        {
          stepName: {
            type: String,
            required: true
          },
          stepWeight: {
            type: Number
            //required: true
          },
          stepScore: {
            type: Number
            //required: true
          },
          stepValue: {
            type: String,
            required: true
          }
        }
      ]
    }
  },
  pictures: [String],
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
  },
  globalComment: {
    type: String
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

ShopReportSchema.virtual("actionPlans", {
  ref: "ActionPlan",
  localField: "_id",
  foreignField: "owner"
});

const ShopReport = mongoose.model("ShopReport", ShopReportSchema);

module.exports = ShopReport;
