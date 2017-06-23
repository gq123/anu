import { beforeHook, afterHook, browser } from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'dist/React';

describe("组件生命周期",()=>{
    before(async() => {
        await beforeHook();
    });
    after(async() => {
        await afterHook(false);
    })
    var body = document.body, div
    beforeEach(function () {
        div = document.createElement('div')
        body.appendChild(div)
    })
    afterEach(function () {
        body.removeChild(div)

    })
    it("unmount",async ()=>{
        class LifeCycle extends React.Component{
            constructor(props) {
                super(props);
                alert("Initial render");
                alert("constructor");
                this.state = {str: "hello"};
            }
            componentWillMount(){
                console.log("componentWillMount");
            }
            componentDidMount(){
                console.log("componentDidMount");
            }
            //接到上面传来的props触发
            componentWillReceiveProps(nextProps) {
                console.log("componentWillReceiveProps");
            }
            shouldComponentUpdate() {
                console.log("shouldComponentUpdate");
                return true;        // 记得要返回true
            }

            componentWillUpdate(){
                console.log("componentWillUpdate")
            }
            componentDidUpdate(){
                console.log("componentDidUpdate")
            }

            setTheState() {
                let s = "hello";
                if (this.state.str === s) {
                    s = "HELLO";
                }
                this.setState({
                    str: s
                });
            }

            forceItUpdate() {
                this.forceUpdate();
            }

            render() {
                alert("render");
                return(
                    <div>
                        <span>{"Props:"}<h2>{parseInt(this.props.num)}</h2></span>
                        <br />
                        <span>{"State:"}<h2>{this.state.str}</h2></span>
                    </div>
                );
            }
        }

        class Container  extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    num: Math.random() * 100
                };
            }

            propsChange() {
                this.setState({
                    num: Math.random() * 100
                });
            }

            setLifeCycleState() {
                this.refs.rLifeCycle.setTheState();
            }

            forceLifeCycleUpdate() {
                this.refs.rLifeCycle.forceItUpdate();
            }

            unmountLifeCycle() {
                // 这里卸载父组件也会导致卸载子组件
                React.unmountComponentAtNode(div);
            }

            parentForceUpdate() {
                this.forceUpdate();
            }
            componentWillUnmount(){
                console.log("componentWillUnmount")
            }
            render() {
                alert("hh")
                return (
                    <div ref="container">
                        <a onClick={this.propsChange.bind(this)}>propsChange</a>
                        <a onClick={this.setLifeCycleState.bind(this)}>setState</a>
                        <a onClick={this.forceLifeCycleUpdate.bind(this)}>forceUpdate</a>
                        <a ref="umount" onClick={this.unmountLifeCycle.bind(this)}>unmount</a>
                        <a onClick={this.parentForceUpdate.bind(this)}>parentForceUpdateWithoutChange</a>
                        <LifeCycle ref="rLifeCycle" num={this.state.num}></LifeCycle>
                    </div>
                );
            }
        }
        let s = React.render(<Container />,div)
        let nodes = s.refs.container.childNodes
        //await browser.click(nodes[3]).pause(100).$apply()
        await browser.click(nodes[0]).pause(100).$apply()
        await browser.click(nodes[1]).pause(100).$apply()
        await browser.click(nodes[2]).pause(100).$apply()
        await browser.click(nodes[4]).pause(100).$apply()
        await browser.click(nodes[3]).pause(100).$apply()
    })
})