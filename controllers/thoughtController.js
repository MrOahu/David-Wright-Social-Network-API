const { Thought } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();

      res.json(thoughts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a thought and remove them from the user
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No such thought exists' });
      }
      res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a reaction to a thought
  async addReaction(req, res) {


    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with that ID :(' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a reaction from a thought
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with that ID :(' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
