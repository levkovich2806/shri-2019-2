/**
 * Поиск кратчайшего расстояния от звезды start до звезды finish и пути, по которому нужно пройти
 * 
 * @param {Object} graph объект, в котором ключами являются названия звёзд, а значениями — расстояния до звёзд
 * @param {String} start название начальной точки пути
 * @param {String} finish название конечной точки пути
 */
const solution = function (graph, start, finish) {
  // Объект с "параметрами" вершин - редактируем его по ходу обработки данных
  let vertexData = {};
  const keys = Object.keys(graph);

  //Заполняем объект vertexData "начальными" данными
  for (let vertex of keys) {
    // Устанавливаем "веса" вершин в максимально возможные значения (альтернатива бесконечности), а первую в 0
    const weight = (vertex === start) ? 0 : Number.POSITIVE_INFINITY;

    vertexData[vertex] = {
      vertex,
      weight,
    };
  }

  let elem = start;
  while (elem !== finish) {
    //Берем елемент из принимаемого в функцию объекта graph
    const graphElem = graph[elem];
    //Берем элемент из vertexData, что бы потом использовать его для получения weight
    const vertexElem = vertexData[elem];

    //Перебираем все пары graphElem
    for (let key in graphElem) {
      //Получаем "итоговый" вес ребра до вершины "key"
      const weight = vertexElem.weight + graphElem[key];

      //Если "итоговый" вес меньше актуального на данный момент, то делаем его актуальным и вносим изменения в объект vertexData
      if (weight < vertexData[key].weight) {
        vertexData[key] = {
          ...vertexData[key], ...{ weight, from: elem }
        };
      }
    }

    //Помечаем, что точка обработана, что бы не принимать ее во внимание при поиске следующей для анализа в getNextVertex
    vertexData[elem].checked = true;

    // Ищем следующую вершину с которой будем работать
    elem = getNextVertex(vertexData);
  }

  // Готовим массив точек, через которые надо строить маршрут
  const path = getPath(vertexData);
  console.log(path);
  return {
    distance: vertexData.finish.weight,
    path,
  };
}

/**
 * Поиск вершины с минимальным весом из еще не обработанных
 * 
 * @param {Object} data параметры вершин
 */
const getNextVertex = function (data) {
  let result = {
    min: Number.MAX_SAFE_INTEGER,
    key: "",
  };
  for (let key in data) {
    const { weight, vertex, checked } = data[key];
    //Исключаем уже обработанные точки
    if (!checked) {
      if (weight < result.min) {
        result = {
          min: weight,
          key: vertex,
        }
      }
    }
  }
  return result.key;
}

/**
 * Получение массива вершин пути, по которому нужно пройти
 * 
 * @param {Object} data параметры вершин
 */
const getPath = function (data) {
  let vertex = finish;
  let path = [vertex];
  while (vertex !== start) {
    const { from } = data[vertex];
    path.push(from);
    vertex = from;
  }
  return path.reverse();
}