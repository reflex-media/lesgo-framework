"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _elasticsearch=require("@elastic/elasticsearch"),_AwsElasticSearchConnection=_interopRequireDefault(require("./aws/AwsElasticSearchConnection"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class ElasticSearchService{constructor({index:a,type:b,connection:c,options:d}){this.index=a,this.type=b,this.options=d,this.setConnection(c)}setConnection(a){let b=null;switch(a){case"aws":const c=new _AwsElasticSearchConnection.default;c.setRegion(this.options.awsRegion),b=c;break;default:b=_elasticsearch.Connection;}return this.client=new _elasticsearch.Client({...this.options,Connection:b}),this}search(a){return new Promise((b,c)=>{const d={index:this.index,type:this.type,body:a};this.client.search(d,(a,d)=>{a&&c(a),this.result=d,b(d)})})}createIndices(a,b){const c={index:a,include_type_name:!0,body:b};return new Promise((a,b)=>{this.client.indices.create(c,(c,d)=>{c?b(c):a(d)})})}get(a){const b={index:this.index,type:this.type,id:a};return new Promise((a,c)=>{this.client.get(b,(b,d)=>{b?c(b):a(d)})})}indexOrCreateById(a){const b={index:this.index,type:this.type,id:a.id,body:a};return new Promise((a,c)=>{this.client.index(b,(b,d)=>{b?c(b):a(d)})})}bulkIndex(a){return new Promise((b,c)=>{this.client.bulk({body:this.constructBulkIndex(a)},(a,d)=>{a?c(a):b(d)})})}create(a,b){const c={index:this.index,type:this.type,id:a,body:b};return new Promise((a,b)=>{this.client.index(c,(c,d)=>{c?b(c):a(d)})})}updateById(a){const b={index:this.index,type:this.type,id:a};return new Promise((a,c)=>{this.client.get(b,(b,d)=>{b?c(b):a(d)})})}constructBulkIndex(a){const b=[];return a.forEach(a=>{b.push({index:{_index:this.index,_type:this.type,_id:a.id}}),b.push(a)}),b}}var _default=ElasticSearchService;exports.default=_default;