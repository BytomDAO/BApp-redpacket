# redpacket RPC API

JSON RPC is a stateless, light-weight remote procedure call (RPC) protocol. The composition of request URL is that:

```js
http_protocol://ip:port/dapp

eg: 
http://127.0.0.1:3100/dapp
```

The example of redpacket RPC is that:

```bash
curl -X POST http://127.0.0.1:3100/dapp/create-redpacket -d '{"password":"123456"}'
```

## Available API methods

* [`create-redpacket`](#create-redpacket)
* [`submit-redpacket`](#submit-redpacket)
* [`open-redpacket`](#open-redpacket)
* [`get-redpacket-details`](#get-redpacket-details)
* [`list-sender-redpackets`](#list-sender-redpackets)
* [`list-receiver-redpackets`](#list-receiver-redpackets)
* [`get-redpacket-password`](#get-redpacket-password)

----

## create-redpacket

create red packet contract address.

### Parameters

- String - `password`, the password of redpacket.

### Returns

- String - `address`, the contract address of redpacket.
- String - `red_packet_id`, the unique ID of redpacket.

### Example


// request
```json
{
  "password": "123456"
}
```

// response
```json
{
  "address": "sm1quntz5ch3a8kw2xs32jxp8fughkznk4dqte02pjac74rvu9u9fwmqqqae87",
  "red_packet_id": "dd73e414-2642-4872-a922-62f44caad092"
}
```

-----

## submit-redpacket

submit transaction for sending red packet.

### Parameters

- String - `red_packet_id`, the unique ID of redpacket.
- String - `tx_id`, the transaction ID of sending redpacket.
- String - `address`, the address of redpacket sender.
- String - `address_name`, the name of redpacket sender address.
- String - `amount`, the amount of redpacket sender.
- Integer - `red_packet_type`, the red packet type.
- String - `note`, (optional)the note of redpacket.

### Returns

null

### Example

```js
// request
{
  "red_packet_id": "dd73e414-2642-4872-a922-62f44caad092",
  "tx_id": "f572b640e1a33f474ab63bc7023575c4367718c27c0a9983cbf248a7e285ba65",
  "address": "sm1qykcpcn662adgkleurzs2rf6grzx2j8qsk0zdql",
  "address_name": "my_name",
  "amount": 163010000,
  "note": "remarks"
}

// response
null
```

-----

## open-redpacket

open red packet by submitting receiving transaction.

### Parameters

- String - `red_packet_id`, the unique ID of redpacket.
- String - `address`, the address of redpacket receicer.
- String - `password`, the password of redpacket.

### Returns

- Integer - `status`, the status of redpacket.
- String - `message`, the message of redpacket.

### Example

```js
// request
{
  "red_packet_id": "dd73e414-2642-4872-a922-62f44caad092",
  "address": "sm1qpwr36dj5w5k664dl53ry07vkvnrcjnp7evqx6p",
  "password": "123456"
}

// response
{
  "status": 200,
  "message": "ok"
}
```

-----

## get-redpacket-details

query the detail for specified red packet.

### Parameters

- String - `red_packet_id`, the unique ID of redpacket.

### Returns

- String - `sender_address`, the sender address.
- String - `sender_address_name`, the sender address name.
- String - `asset_id`, the asset id of redpacket.
- String - `red_packet_id`, the ID of redpacket.
- Integer - `red_packet_type`, the type of redpacket.
- String - `total_amount`, the total amount of redpacket.
- Integer - `total_number`, the total number of redpacket.
- Integer - `opened_number`, the total opened number of redpacket.
- String - `note`, the note of redpacket.
- Boolean - `is_confirmed`, the transaction confirmed status of sending redpacket.
- Integer - `send_time`, the success transaction time of sending redpacket.
- Object - `winners`, Array type, the list of redpacket receicers.
  - String - `address`, the address of redpacket receicer.
  - String - `amount`, the amount of redpacket receicer.
  - String - `tx_id`, the transaction ID of receicing redpacket.
  - Boolean - `is_confirmed`, the transaction confirmed status of receicing redpacket.
  - Integer - `confirmed_time`, the success transaction time for receiving redpacket.

### Example

```js
// request
{
	"red_packet_id":"dd73e414-2642-4872-a922-62f44caad092"
}

// response
{
  "sender_address": "sm1qeujlyjj4tx7utw33t2mdkkr2x5d5d86jy8wlpf",
  "sender_address_name": "my_name",
  "asset_id": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  "red_packet_id": "dd73e414-2642-4872-a922-62f44caad092",
  "red_packet_type": 2,
  "total_amount": "3.5",
  "total_number": 3,
  "opened_number": 3,
  "note": "first",
  "is_confirmed": true,
  "send_time": 1558002511,
  "winners": [
    {
      "address": "sm1qs02n4egvlh9lpha8ccrfhdrxyvjhcezekkx3df",
      "amount": "0.998",
      "tx_id": "e7bf73ae9126c16bb3482bbd06c7342ab19cca16c98dc5e446b8984f74a6611f",
      "is_confirmed": true,
      "confirmed_time": 1558002464
    },
    {
      "address": "sm1q9h2q9y77dur2hzz9fx9y5p80lq3yzut4lmtgy4",
      "amount": "1.998",
      "tx_id": "ab894c479a7688c980b5ef5aeccffabaa4cc59bb6ae71d8440129d560763be0c",
      "is_confirmed": true,
      "confirmed_time": 1558002464
    },
    {
      "address": "sm1q56tv9nwjq2d9el3hhtyp2h2dczm6n8tueen9nk",
      "amount": "2.998",
      "tx_id": "3c902d50fc04775688af5abb37cb7e8378bce045859e013818a932123c325154",
      "is_confirmed": true,
      "confirmed_time": 1558002465
    }
  ]
}
```

-----

## list-sender-redpackets

list all red packets for specified sender.

### Parameters

- String - `address`, the address of redpacket sender.
- String(optional) - `asset_id`, the asset id of redpacket.

If asset is empty, list all assets' sender redpacket.

### Returns

- String - `total_amount`, the total amount of redpacket for sender.
- Integer - `total_number`, the total number of redpacket for sender.
- Object - `sender_details`, Array type, the list of redpackets for the specified sender.
  - String - `sender_address`, the sender address.
  - String - `sender_address_name`, the sender address name.
  - String - `asset_id`, the asset id of redpacket.
  - String - `red_packet_id`, the ID of redpacket.
  - Integer - `red_packet_type`, the type of redpacket.
  - String - `total_amount`, the total amount of redpacket.
  - Integer - `total_number`, the total number of redpacket.
  - Integer - `opened_number`, the total opened number of redpacket.
  - String - `note`, the note of redpacket.
  - Boolean - `is_confirmed`, the transaction confirmed status of sending redpacket.
  - Integer - `send_time`, the success transaction time of sending redpacket.

### Example

```js
// request
{
  "address": "sm1qeujlyjj4tx7utw33t2mdkkr2x5d5d86jy8wlpf"
}

// response
{
  "total_amount": "30",
  "total_number": 6,
  "sender_details": [
    {
      "sender_address": "sm1qq494j3sv9r4qfm4v29rhl4arxpwgx7h5kpgru9",
      "sender_address_name": "my_name",
      "asset_id": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",  
      "red_packet_id": "424c8b55-7234-43fd-976d-e44eb459f859",
      "red_packet_type": 2,
      "total_amount": "15",
      "total_number": 5,
      "opened_number": 5,
      "note": "first",
      "is_confirmed": false,
      "send_time": 1558002511
    },
    {
      "sender_address": "sm1qq494j3sv9r4qfm4v29rhl4arxpwgx7h5kpgru9",
      "sender_address_name": "my_name",
      "asset_id": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "red_packet_id": "73051203-18ae-4593-bd5e-841a40b93311",
      "red_packet_type": 2,
      "total_amount": "15",
      "total_number": 5,
      "opened_number": 3,
      "note": "note",
      "is_confirmed": false,
      "send_time": 1558004725
    }
  ]
}
```

-----

## list-receiver-redpackets

list all red packets for specified receiver.

### Parameters

- String - `address`, the address of redpacket receicer.
- String(optional) - `asset_id`, the asset id of redpacket.

If asset is empty, list all assets' receiver redpacket.

### Returns

- String - `total_amount`, the total amount of redpacket for receicer.
- Integer - `total_number`, the total number of redpacket for receicer.
- Object - `receiver_details`, Array type, the list of redpackets for the specified receicer.
  - String - `sender_address`, the sender address of redpacket.
  - String - `sender_address_name`, the sender address name.
  - String - `asset_id`, the asset id of redpacket.
  - Integer - `red_packet_type`, the type of redpacket.
  - String - `note`, the note of redpacket.
  - String - `address`, the receiver address.
  - String - `amount`, the received amount.
  - String - `tx_id`, the transaction ID for receiving redpacket.
  - Boolean - `is_confirmed`, the confirmed status for receiving redpacket.
  - Integer - `confirmed_time`, the success transaction time for receiving redpacket.

### Example

```js
// request
{
  "address": "sm1q8len93mc3g6lj832fu6cmscg8x0y9r303cjl4d"
}

// response
{
  "total_amount": "30",
  "total_number": 1,
  "receiver_details": [
    {
      "sender_address": "sm1qeujlyjj4tx7utw33t2mdkkr2x5d5d86jy8wlpf",
      "sender_address_name": "my_name",
      "asset_id": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "red_packet_type": 2,
      "note": "first",
      "address": "sm1q8len93mc3g6lj832fu6cmscg8x0y9r303cjl4d",
      "amount": "10",
      "tx_id": "7c1a2114dd2d18e13c0100a117cdec63b94dfc15576e8c0e74000090d1957fcc",
      "is_confirmed": true,
      "confirmed_time": 1557989929
    },
    {
      "sender_address": "sm1qeujlyjj4tx7utw33t2mdkkr2x5d5d86jy8wlpf",
      "sender_address_name": "my_name",
      "asset_id": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "red_packet_type": 1,
      "note": "000000",
      "address": "sm1q8len93mc3g6lj832fu6cmscg8x0y9r303cjl4d",
      "amount": "20",
      "tx_id": "5719a71dd286f03dbe1516c8c5ff02f3f1580d3ce26dd1559e498643e8d1601d",
      "is_confirmed": true,
      "confirmed_time": 1557989000
    }
  ]
}
```

-----

## get-redpacket-password

query the password for the specified red packet.

### Parameters

- String - `red_packet_id`, the unique ID of redpacket.
- String - `sender_address`, the sender address.

### Returns

- String - `password`, the password of redpacket.

### Example

```js
// request
{
  "red_packet_id": "43aeeea9-564f-4d5f-9727-90de0cfc342e",
  "sender_address": "sm1q2m4wg6g2hmsc9yz7zr8vhgtmme3uzsjcqm4ns0"
}

// response
{
  "password": "123456"
}
```
