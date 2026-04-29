const buckets = new Map();

const now = () => Date.now();

const sanitizeKeyPart = (value) => String(value || 'unknown').trim().toLowerCase();

const getClientIp = (req) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
        return forwardedFor.split(',')[0].trim();
    }
    return req.ip || req.socket?.remoteAddress || 'unknown-ip';
};

export const getEmailKeyPart = (req) => sanitizeKeyPart(req.body?.email);

export const buildIpEmailKey = (req) => `${getClientIp(req)}:${getEmailKeyPart(req)}`;

export const consumeRateLimit = (key, { windowMs, max }) => {
    const bucketKey = sanitizeKeyPart(key);
    const currentTime = now();
    const existing = buckets.get(bucketKey);

    if (!existing || existing.resetAt <= currentTime) {
        buckets.set(bucketKey, {
            count: 1,
            resetAt: currentTime + windowMs,
        });
        return { allowed: true, remaining: max - 1, retryAfter: 0 };
    }

    if (existing.count >= max) {
        return {
            allowed: false,
            remaining: 0,
            retryAfter: Math.ceil((existing.resetAt - currentTime) / 1000),
        };
    }

    existing.count += 1;
    return {
        allowed: true,
        remaining: max - existing.count,
        retryAfter: 0,
    };
};

export const createRateLimit = ({
    windowMs,
    max,
    message = 'Too many requests. Please try again later.',
    keyGenerator = getClientIp,
}) => {
    return (req, res, next) => {
        const key = keyGenerator(req);
        const result = consumeRateLimit(key, { windowMs, max });

        res.setHeader('X-RateLimit-Limit', String(max));
        res.setHeader('X-RateLimit-Remaining', String(result.remaining));

        if (!result.allowed) {
            res.setHeader('Retry-After', String(result.retryAfter));
            return res.status(429).json({
                error: message,
                retryAfter: result.retryAfter,
            });
        }

        next();
    };
};

setInterval(() => {
    const currentTime = now();
    for (const [key, bucket] of buckets.entries()) {
        if (bucket.resetAt <= currentTime) {
            buckets.delete(key);
        }
    }
}, 60 * 1000).unref();
