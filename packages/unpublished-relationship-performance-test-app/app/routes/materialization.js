import Route from '@ember/routing/route';

import CARS_PAYLOAD from '../utils/generate-fixtures-for-materialization-scenario';

export default Route.extend({
  model() {
    // having imported this ensures fixture generation
    // is not measured within start-find-all to end-find-all
    CARS_PAYLOAD;
    performance.mark('start-find-all');
    return this.store.findAll('car', { reload: true }).then((cars) => {
      performance.mark('start-outer-materialization');
      const flattened = cars.map((car) => {
        // enforce materialization of our relationships
        return {
          name: car.id,
          size: car.size.name,
          type: car.type.name,
          colors: car.colors.map((color) => color.name),
        };
      });
      performance.mark('stop-outer-materialization');
      performance.measure('outer-materialization', 'start-outer-materialization', 'stop-outer-materialization');

      performance.mark('end-find-all');
      performance.measure('find-all', 'start-find-all', 'end-find-all');

      return flattened;
    });
  },
});
