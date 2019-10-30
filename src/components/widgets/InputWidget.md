Sample input field widgets

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<InputWidget 
					v-model="form.email.val"
					placeholder="Email *"
					name="email"
					maxlength="254"
					:showLabel="form.email.displayLabel"
					:flag="!form.email.valid || form.email.flag" />
					
				<InputWidget 
					v-model="form.amount.val"
					placeholder="Amount *"
					name="amount"
					:showLabel="form.amount.displayLabel"
					:flag="form.amount.flag"
					:iconClass="{gold:form.amount.val >= 1, silver:form.amount.val < 1}" />

				<InputWidget 
					inputType="password"
					v-bind="{hideShow: true}"
					v-model="form.password.val"
					placeholder="Password *"
					name="password"
					maxlength="254"
					ref="password"
					:showLabel="form.password.displayLabel"
					:flag="form.password.flag" />
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night">
				<InputWidget 
					v-model="form.email.val"
					placeholder="Email *"
					name="email"
					maxlength="254"
					:showLabel="form.email.displayLabel"
					:flag="!form.email.valid || form.email.flag" />
					
				<InputWidget 
					v-model="form.amount.val"
					placeholder="Amount *"
					name="amount"
					:showLabel="form.amount.displayLabel"
					:flag="form.amount.flag"
					:iconClass="{gold:form.amount.val >= 1, silver:form.amount.val < 1}" />

				<InputWidget 
					inputType="password"
					v-bind="{hideShow: true}"
					v-model="form.password.val"
					placeholder="Password *"
					name="password"
					maxlength="254"
					ref="password"
					:showLabel="form.password.displayLabel"
					:flag="form.password.flag" />
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			form: {
				email: {
					val: '',
					displayLabel: false,
					valid: true,
					flag: false,
				},
				amount: {
					val: '',
					displayLabel: false,
					flag: false,
				},
				password: {
					val: '',
					displayLabel: false,
					flag: false,
				},
			},
		};
	},
};
</script>
```
