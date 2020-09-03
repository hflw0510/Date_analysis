<template>
  <div>
    <p>{{ da }}</p>
  </div>
</template>

<script>
import Datastore from 'nedb';

let da, db = new Datastore();
db.insert([
    {a: 'nfjhfefjhglkj'}
], function (err, newArray) {
    da = newArray;
    console.log(err)
})

export default {
  data () {
    return {
        da
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>