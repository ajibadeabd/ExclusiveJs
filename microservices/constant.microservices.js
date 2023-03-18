// import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

// export const TCP_DEFAULT_PORT = 3000;
// export const TCP_DEFAULT_HOST = 'localhost';

// export const REDIS_DEFAULT_PORT = 6379;
// export const REDIS_DEFAULT_HOST = 'localhost';

// export const NATS_DEFAULT_URL = 'nats://localhost:4222';
// export const MQTT_DEFAULT_URL = 'mqtt://localhost:1883';
// export const GRPC_DEFAULT_URL = 'localhost:5000';
// export const RQM_DEFAULT_URL = 'amqp://localhost';
// export const KAFKA_DEFAULT_BROKER = 'localhost:9092';

// export const CONNECT_EVENT = 'connect';
// export const DISCONNECT_EVENT = 'disconnect';
// export const CONNECT_FAILED_EVENT = 'connectFailed';
// export const MESSAGE_EVENT = 'message';
// export const DATA_EVENT = 'data';
// export const ERROR_EVENT = 'error';
// export const CLOSE_EVENT = 'close';
// export const SUBSCRIBE = 'subscribe';
// export const CANCEL_EVENT = 'cancelled';

// export const PATTERN_METADATA = 'microservices:pattern';
// export const PATTERN_EXTRAS_METADATA = 'microservices:pattern_extras';
// export const TRANSPORT_METADATA = 'microservices:transport';
// export const CLIENT_CONFIGURATION_METADATA = 'microservices:client';
// export const PATTERN_HANDLER_METADATA = 'microservices:handler_type';
// export const CLIENT_METADATA = 'microservices:is_client_instance';
// export const PARAM_ARGS_METADATA = ROUTE_ARGS_METADATA;

// export const REQUEST_PATTERN_METADATA = 'microservices:request_pattern';
// export const REPLY_PATTERN_METADATA = 'microservices:reply_pattern';

// export const RQM_DEFAULT_QUEUE = 'default';
// export const RQM_DEFAULT_PREFETCH_COUNT = 0;
// export const RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT = false;
// export const RQM_DEFAULT_QUEUE_OPTIONS = {};
// export const RQM_DEFAULT_NOACK = true;
// export const RQM_DEFAULT_PERSISTENT = false;
// export const RQM_DEFAULT_NO_ASSERT = false;
// export const GRPC_DEFAULT_PROTO_LOADER = '@grpc/proto-loader';

// export const NO_EVENT_HANDLER = (text, pattern) =>
//   `There is no matching event handler defined in the remote service. Event pattern: ${pattern}`;
// export const NO_MESSAGE_HANDLER = `There is no matching message handler defined in the remote service.`;

// export const DISCONNECTED_RMQ_MESSAGE = `Disconnected from RMQ. Trying to reconnect.`;

// export const KAFKA_DEFAULT_CLIENT = 'nestjs-consumer';
// export const KAFKA_DEFAULT_GROUP = 'nestjs-group';

// export const MQTT_SEPARATOR = '/';
// export const MQTT_WILDCARD_SINGLE = '+';
// export const MQTT_WILDCARD_ALL = '#';

// export const ECONNREFUSED = 'ECONNREFUSED';
// export const CONN_ERR = 'CONN_ERR';
// export const EADDRINUSE = 'EADDRINUSE';

// export const CONNECTION_FAILED_MESSAGE =
//   'Connection to transport failed. Trying to reconnect...';
const TCP_DEFAULT_PORT = 3000;
const TCP_DEFAULT_HOST = 'localhost';

const REDIS_DEFAULT_PORT = 6379;
const REDIS_DEFAULT_HOST = 'localhost';

const NATS_DEFAULT_URL = 'nats://localhost:4222';
const MQTT_DEFAULT_URL = 'mqtt://localhost:1883';
const GRPC_DEFAULT_URL = 'localhost:5000';
const RQM_DEFAULT_URL = 'amqp://localhost';
const KAFKA_DEFAULT_BROKER = 'localhost:9092';

const CONNECT_EVENT = 'connect';
const DISCONNECT_EVENT = 'disconnect';
const CONNECT_FAILED_EVENT = 'connectFailed';
const MESSAGE_EVENT = 'message';
const DATA_EVENT = 'data';
const ERROR_EVENT = 'error';
const CLOSE_EVENT = 'close';
const SUBSCRIBE = 'subscribe';
const CANCEL_EVENT = 'cancelled';

const PATTERN_METADATA = 'microservices:pattern';
const PATTERN_EXTRAS_METADATA = 'microservices:pattern_extras';
const TRANSPORT_METADATA = 'microservices:transport';
const CLIENT_CONFIGURATION_METADATA = 'microservices:client';
const PATTERN_HANDLER_METADATA = 'microservices:handler_type';
const CLIENT_METADATA = 'microservices:is_client_instance';
const PARAM_ARGS_METADATA = 'microservices:args';

const REQUEST_PATTERN_METADATA = 'microservices:request_pattern';
const REPLY_PATTERN_METADATA = 'microservices:reply_pattern';

const RQM_DEFAULT_QUEUE = 'default';
const RQM_DEFAULT_PREFETCH_COUNT = 0;
const RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT = false;
const RQM_DEFAULT_QUEUE_OPTIONS = {};
const RQM_DEFAULT_NOACK = true;
const RQM_DEFAULT_PERSISTENT = false;
const RQM_DEFAULT_NO_ASSERT = false;
const GRPC_DEFAULT_PROTO_LOADER = '@grpc/proto-loader';

const NO_EVENT_HANDLER = function(text, pattern) {
  return `There is no matching event handler defined in the remote service. Event pattern: ${pattern}`;
};
const NO_MESSAGE_HANDLER = 'There is no matching message handler defined in the remote service.';

const DISCONNECTED_RMQ_MESSAGE = 'Disconnected from RMQ. Trying to reconnect.';

const KAFKA_DEFAULT_CLIENT = 'nestjs-consumer';
const KAFKA_DEFAULT_GROUP = 'nestjs-group';

const MQTT_SEPARATOR = '/';
const MQTT_WILDCARD_SINGLE = '+';
const MQTT_WILDCARD_ALL = '#';

const ECONNREFUSED = 'ECONNREFUSED';
const CONN_ERR = 'CONN_ERR';
const EADDRINUSE = 'EADDRINUSE';

const CONNECTION_FAILED_MESSAGE = 'Connection to transport failed. Trying to reconnect...';

module.exports = {
  TCP_DEFAULT_PORT,
  TCP_DEFAULT_HOST,
  REDIS_DEFAULT_PORT,
  REDIS_DEFAULT_HOST,
  NATS_DEFAULT_URL,
  MQTT_DEFAULT_URL,
  GRPC_DEFAULT_URL,
  RQM_DEFAULT_URL,
  KAFKA_DEFAULT_BROKER,
  CONNECT_EVENT,
  DISCONNECT_EVENT,
  CONNECT_FAILED_EVENT,
  MESSAGE_EVENT,
  DATA_EVENT,
  ERROR_EVENT,
  CLOSE_EVENT,
  SUBSCRIBE,
  CANCEL_EVENT,
  PATTERN_METADATA,
  PATTERN_EXTRAS_METADATA,
  TRANSPORT_METADATA,
  CLIENT_CONFIGURATION_METADATA,
  PATTERN_HANDLER_METADATA,
  CLIENT_METADATA,
  PARAM_ARGS_METADATA,
  REQUEST_PATTERN_METADATA,
  REPLY_PATTERN_METADATA,
  RQM_DEFAULT_QUEUE,
  RQM_DEFAULT_PREFETCH_COUNT,
  RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT,
  RQM_DEFAULT_QUEUE_OPTIONS,
  RQM_DEFAULT_NOACK,
  RQM_DEFAULT_PERSISTENT,
  RQM_DEFAULT_NO_ASSERT,
  GRPC_DEFAULT_PROTO_LOADER,
  NO_EVENT_HANDLER,
  NO_MESSAGE_HANDLER,
//   DIS
}