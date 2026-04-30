import User from '../models/User.js';

const normalizeUsernameBase = (name, email) => {
	const rawBase = (name || email?.split('@')[0] || 'user').trim();
	const normalized = rawBase
		.toLowerCase()
		.replace(/\s+/g, '')
		.replace(/[^a-z0-9_]/g, '')
		.slice(0, 20);

	return normalized || 'user';
};

const generateUniqueUsername = async (base) => {
	let candidate = base;
	let suffix = 0;

	while (await User.exists({ username: candidate })) {
		suffix += 1;
		candidate = `${base}${suffix}`.slice(0, 20);
	}

	return candidate;
};

export const findOrCreateGoogleUser = async ({ email, name, picture }) => {
	let user = await User.findOne({ email });
	if (user) {
		const updates = {};
		if (!user.profilePic && picture) updates.profilePic = picture;
		if (!user.provider) updates.provider = 'google';
		if (!user.verified) updates.verified = true;

		if (Object.keys(updates).length > 0) {
			user = await User.findByIdAndUpdate(user._id, updates, { new: true });
		}

		return { user, isNew: false };
	}

	const base = normalizeUsernameBase(name, email);
	const username = await generateUniqueUsername(base);

	user = await User.create({
		username,
		email,
		profilePic: picture || '',
		provider: 'google',
		verified: true,
	});

	return { user, isNew: true };
};
